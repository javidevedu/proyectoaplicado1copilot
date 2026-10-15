import { TOPIC_PATTERNS, matchTopicKey } from './questionBank';
import { parseTopics } from './types';
import { chat, getEngine, isModelCached } from './webllmEngine';

export interface WritingFeedback {
  spelling_errors: { word: string; correction: string; context: string }[];
  grammar_errors: { error: string; correction: string; context: string }[];
  topics_used: string[];
  topics_missing: string[];
  overall_score: number;
  feedback: string;
  word_count: number;
}

type Speller = { correct: (w: string) => boolean; suggest: (w: string) => string[] };
let spellerPromise: Promise<Speller | null> | null = null;

async function getSpeller(): Promise<Speller | null> {
  if (!spellerPromise) {
    spellerPromise = (async () => {
      try {
        const [{ default: nspell }, aff, dic] = await Promise.all([
          import('nspell'),
          fetch('https://cdn.jsdelivr.net/npm/dictionary-en@4/index.aff').then((r) => r.text()),
          fetch('https://cdn.jsdelivr.net/npm/dictionary-en@4/index.dic').then((r) => r.text()),
        ]);
        return nspell(aff, dic) as Speller;
      } catch (e) {
        console.error('Spell checker unavailable', e);
        return null;
      }
    })();
  }
  return spellerPromise;
}

const GRAMMAR_RULES: { re: RegExp; error: string; fix: (m: string) => string }[] = [
  { re: /\b(he|she|it)\s+(don't)\b/gi, error: 'Use "doesn\'t" with he/she/it', fix: (m) => m.replace(/don't/i, "doesn't") },
  { re: /\b(i|you|we|they)\s+(doesn't)\b/gi, error: 'Use "don\'t" with I/you/we/they', fix: (m) => m.replace(/doesn't/i, "don't") },
  { re: /\b(he|she|it)\s+(have)\b/gi, error: 'Use "has" with he/she/it', fix: (m) => m.replace(/have/i, 'has') },
  { re: /\b(i)\s+(is|are)\b/gi, error: 'Use "am" with I', fix: (m) => m.replace(/(is|are)$/i, 'am') },
  { re: /\b(he|she|it)\s+(are)\b/gi, error: 'Use "is" with he/she/it', fix: (m) => m.replace(/are$/i, 'is') },
  { re: /\b(we|they|you)\s+(is|was)\b/gi, error: 'Use "are/were" with we/they/you', fix: (m) => m.replace(/is$/i, 'are').replace(/was$/i, 'were') },
  { re: /\ba\s+[aeiou]\w*/gi, error: 'Use "an" before a vowel sound', fix: (m) => m.replace(/^a/i, 'an') },
  { re: /\b(\w+)\s+\1\b/gi, error: 'Repeated word', fix: (m) => m.split(/\s+/)[0] },
  { re: /\bmore\s+\w+er\b/gi, error: 'Do not use "more" with -er comparatives', fix: (m) => m.replace(/^more\s+/i, '') },
];

function sentenceOf(text: string, index: number): string {
  const start = Math.max(text.lastIndexOf('.', index), text.lastIndexOf('!', index), text.lastIndexOf('?', index)) + 1;
  const endIdx = text.slice(index).search(/[.!?]/);
  return text.slice(start, endIdx === -1 ? undefined : index + endIdx + 1).trim();
}

/** Pure scoring used by tests: 0 if empty. */
export function computeScore(wordCount: number, wordLimit: number, spelling: number, grammar: number, topicsUsed: number, topicsTotal: number): number {
  if (wordCount === 0) return 0;
  const length = Math.min(1, wordCount / Math.max(1, wordLimit * 0.8)) * 3;
  const topics = topicsTotal ? (topicsUsed / topicsTotal) * 3 : 3;
  const accuracy = Math.max(0, 4 - (spelling * 0.5 + grammar * 0.7));
  return Math.round(Math.min(10, length + topics + accuracy));
}

export async function gradeWriting(text: string, topicsCsv: string, wordLimit: number): Promise<WritingFeedback> {
  const clean = (text || '').trim();
  const words = clean ? clean.split(/\s+/) : [];
  const topics = parseTopics(topicsCsv);

  const spelling_errors: WritingFeedback['spelling_errors'] = [];
  const speller = clean ? await getSpeller() : null;
  if (speller) {
    const seen = new Set<string>();
    const re = /[A-Za-z']+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(clean))) {
      const w = m[0].replace(/^'+|'+$/g, '');
      if (w.length < 2 || seen.has(w.toLowerCase())) continue;
      if (!speller.correct(w) && !speller.correct(w.toLowerCase())) {
        seen.add(w.toLowerCase());
        spelling_errors.push({ word: w, correction: speller.suggest(w)[0] ?? '?', context: sentenceOf(clean, m.index) });
      }
    }
  }

  const grammar_errors: WritingFeedback['grammar_errors'] = [];
  for (const rule of GRAMMAR_RULES) {
    for (const m of clean.matchAll(rule.re)) {
      if (rule.error === 'Repeated word' && /^(that|had)$/i.test(m[1] ?? '')) continue;
      grammar_errors.push({ error: `${rule.error}: "${m[0]}"`, correction: rule.fix(m[0]), context: sentenceOf(clean, m.index ?? 0) });
    }
  }

  const keys = Object.keys(TOPIC_PATTERNS);
  const topics_used: string[] = [];
  const topics_missing: string[] = [];
  for (const t of topics) {
    const k = matchTopicKey(t, keys);
    let used: boolean;
    if (k) used = TOPIC_PATTERNS[k].test(clean);
    else {
      // vocabulary themes etc.: look for any significant word of the topic name
      const kw = t.toLowerCase().replace(/vocabulary:/, '').split(/[^a-z]+/).filter((w) => w.length > 3);
      used = kw.some((w) => clean.toLowerCase().includes(w.slice(0, 5)));
    }
    (used && clean ? topics_used : topics_missing).push(t);
  }

  const overall_score = computeScore(words.length, wordLimit, spelling_errors.length, grammar_errors.length, topics_used.length, topics.length);

  const parts: string[] = [];
  if (!clean) parts.push('No text was written.');
  else {
    parts.push(`You wrote ${words.length} words (target: ${wordLimit}).`);
    parts.push(spelling_errors.length ? `Check the spelling of ${spelling_errors.length} word(s).` : 'Good spelling!');
    if (grammar_errors.length) parts.push(`Review ${grammar_errors.length} grammar point(s).`);
    if (topics_missing.length) parts.push(`Try to include: ${topics_missing.join(', ')}.`);
    else if (topics.length) parts.push('You used all the required topics. Well done!');
  }
  let feedback = parts.join(' ');

  // Optional short comment from the local AI if it is already downloaded on this device.
  if (clean && (await isModelCached())) {
    try {
      const engine = await Promise.race([getEngine(), new Promise<never>((_, r) => setTimeout(() => r(new Error('timeout')), 30000))]);
      const ai = await chat(engine, 'You are a kind English teacher. Answer in 2 short sentences.',
        `Give brief feedback on this student text (topics: ${topicsCsv}):\n"${clean.slice(0, 1500)}"`, 120);
      if (ai.trim()) feedback += ' ' + ai.trim();
    } catch { /* keep rule-based feedback */ }
  }

  return { spelling_errors, grammar_errors, topics_used, topics_missing, overall_score, feedback, word_count: words.length };
}
