import { PASSAGES, GRAMMAR_ITEMS, matchTopicKey } from './questionBank';
import { bandFor, distribute, parseTopics, type GenerateParams, type GeneratedQuestion } from './types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mcFromPassages(level: string, n: number, listening: boolean): GeneratedQuestion[] {
  const passages = shuffle(PASSAGES[bandFor(level)]);
  const items: GeneratedQuestion[] = [];
  let pi = 0;
  while (items.length < n && passages.length) {
    const p = passages[pi % passages.length];
    const qi = Math.floor(pi / passages.length);
    const item = p.questions[qi % p.questions.length];
    items.push(listening
      ? { type: 'listening', audio_script: p.text, question_text: item.q, option_a: item.options[0], option_b: item.options[1], option_c: item.options[2], option_d: item.options[3], correct_answer: item.answer }
      : { type: 'multiple_choice', question_text: `${p.title}\n\n${p.text}\n\n${item.q}`, option_a: item.options[0], option_b: item.options[1], option_c: item.options[2], option_d: item.options[3], correct_answer: item.answer });
    pi++;
    if (pi > 50) break;
  }
  return items;
}

/** Grammar items for selected topics (used to enrich reading section). */
function grammarItems(topics: string[]): GeneratedQuestion[] {
  const keys = Object.keys(GRAMMAR_ITEMS);
  const out: GeneratedQuestion[] = [];
  for (const t of topics) {
    const k = matchTopicKey(t, keys);
    if (!k) continue;
    for (const it of GRAMMAR_ITEMS[k]) {
      out.push({ type: 'fill_blank', question_text: `Complete the sentence (${t}):\n${it.sentence}`, correct_answer: it.answer });
    }
  }
  return shuffle(out);
}

export function writingPrompt(level: string, topics: string[], words: number, idx: number): GeneratedQuestion {
  const themes = ['your last holiday', 'your daily routine', 'your favourite place in your city', 'a person you admire', 'the role of technology in your life', 'your plans for the future'];
  const theme = themes[idx % themes.length];
  const list = topics.slice(0, 4).join(', ');
  return {
    type: 'writing',
    question_text: `Write a text of about ${words} words about ${theme}. You must use these topics/structures: ${list}. Write at ${level} level and check your spelling.`,
    correct_answer: `Model answer: a well-organised text of about ${words} words about ${theme} that clearly uses ${list}.`,
  };
}

function speakingPrompts(level: string, n: number): GeneratedQuestion[] {
  return shuffle(PASSAGES[bandFor(level)]).slice(0, n).map((p) => ({ type: 'speaking' as const, question_text: p.text, correct_answer: p.text }));
}

export function generateFromBank(params: GenerateParams): GeneratedQuestion[] {
  const dist = distribute(params.num_questions, params.skills);
  const topics = parseTopics(params.topics);
  const out: GeneratedQuestion[] = [];

  if (dist.reading) {
    const grammar = grammarItems(topics);
    const nGrammar = Math.min(grammar.length, Math.floor(dist.reading / 2));
    out.push(...grammar.slice(0, nGrammar), ...mcFromPassages(params.mcer_level, dist.reading - nGrammar, false));
  }
  if (dist.listening) out.push(...mcFromPassages(params.mcer_level, dist.listening, true));
  if (dist.writing) for (let i = 0; i < dist.writing; i++) out.push(writingPrompt(params.mcer_level, topics, params.writing_word_limit, i));
  if (dist.speaking) {
    const sp = speakingPrompts(params.mcer_level, dist.speaking);
    while (sp.length < dist.speaking) sp.push(sp[sp.length % Math.max(1, sp.length)] ?? speakingPrompts(params.mcer_level, 1)[0]);
    out.push(...sp);
  }
  return out;
}

/** Skill name for a question type. */
export function skillOf(type: GeneratedQuestion['type']): string {
  if (type === 'multiple_choice' || type === 'fill_blank') return 'reading';
  return type;
}
