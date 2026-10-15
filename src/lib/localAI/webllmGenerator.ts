import { z } from 'zod';
import type { InitProgressReport } from '@mlc-ai/web-llm';
import { chat, getEngine } from './webllmEngine';
import { generateFromBank, skillOf } from './templateGenerator';
import { distribute, type GenerateParams, type GeneratedQuestion } from './types';

const LEVEL_RULES: Record<string, string> = {
  A1: 'A1 beginner: very basic words, present simple, very short sentences (5-8 words).',
  A2: 'A2 elementary: everyday words, present/past simple, can/must, short sentences (8-12 words).',
  B1: 'B1 intermediate: present perfect, will/going to, first and second conditionals, connectors like however/although.',
  B2: 'B2 upper-intermediate: wide vocabulary, passive, third conditional, modal perfects, complex sentences.',
  C1: 'C1 advanced: sophisticated vocabulary, inversion, cleft sentences, mixed conditionals.',
  C2: 'C2 mastery: near-native vocabulary, nuance, tone and register.',
};

const mc = z.object({
  question_text: z.string().min(5),
  option_a: z.string().min(1), option_b: z.string().min(1), option_c: z.string().min(1), option_d: z.string().min(1),
  correct_answer: z.string().transform((s) => s.trim().toUpperCase().charAt(0)).pipe(z.enum(['A', 'B', 'C', 'D'])),
  audio_script: z.string().optional(),
});

export function extractJsonArray(text: string): unknown[] {
  const cleaned = text.replace(/```json|```/g, '');
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start === -1 || end <= start) return [];
  try {
    const v = JSON.parse(cleaned.slice(start, end + 1));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

async function genMC(params: GenerateParams, n: number, listening: boolean, onStatus: (s: string) => void): Promise<GeneratedQuestion[]> {
  const engine = await getEngine();
  const out: GeneratedQuestion[] = [];
  const rules = LEVEL_RULES[params.mcer_level] ?? LEVEL_RULES.A2;
  for (let attempt = 0; attempt < 2 && out.length < n; attempt++) {
    onStatus(`Generando ${listening ? 'listening' : 'reading'} (${out.length}/${n})...`);
    const fields = listening
      ? '"audio_script" (3-5 sentences to be read aloud), "question_text" (a question about it)'
      : '"question_text" (a short reading passage followed by a question about it)';
    const user = `Create ${n - out.length} English multiple-choice questions. Level: ${rules} Topics to use: ${params.topics}.
Return ONLY a JSON array. Each item has ${fields}, "option_a", "option_b", "option_c", "option_d" and "correct_answer" ("A","B","C" or "D").`;
    const text = await chat(engine, 'You write English exam questions. Reply with JSON only.', user);
    for (const raw of extractJsonArray(text)) {
      const r = mc.safeParse(raw);
      if (!r.success) continue;
      if (listening && !r.data.audio_script) continue;
      out.push({ ...(r.data as Omit<GeneratedQuestion, 'type'>), type: listening ? 'listening' : 'multiple_choice', audio_script: listening ? r.data.audio_script : null });
      if (out.length >= n) break;
    }
  }
  return out;
}

async function genSpeaking(params: GenerateParams, n: number): Promise<GeneratedQuestion[]> {
  const engine = await getEngine();
  const out: GeneratedQuestion[] = [];
  for (let i = 0; i < n; i++) {
    const text = (await chat(engine, 'You write short English reading-aloud paragraphs. Reply with the paragraph only.',
      `Write one paragraph of 3-5 sentences. Level: ${LEVEL_RULES[params.mcer_level] ?? ''} Use these topics: ${params.topics}.`, 300)).trim();
    if (text.split(/\s+/).length >= 15) out.push({ type: 'speaking', question_text: text, correct_answer: text });
  }
  return out;
}

/**
 * Generate with the local model; any missing or invalid questions are filled from the bank.
 */
export async function generateWithLocalAI(
  params: GenerateParams,
  onProgress: (r: InitProgressReport) => void,
  onStatus: (s: string) => void,
): Promise<GeneratedQuestion[]> {
  await getEngine(onProgress);
  const dist = distribute(params.num_questions, params.skills);
  const bank = generateFromBank(params);
  const fromBank = (skill: string, have: number) =>
    bank.filter((q) => skillOf(q.type) === skill).slice(0, Math.max(0, (dist[skill] ?? 0) - have));

  const result: GeneratedQuestion[] = [];
  for (const skill of params.skills) {
    const n = dist[skill] ?? 0;
    if (!n) continue;
    let ai: GeneratedQuestion[] = [];
    try {
      if (skill === 'reading') ai = await genMC(params, n, false, onStatus);
      else if (skill === 'listening') ai = await genMC(params, n, true, onStatus);
      else if (skill === 'speaking') { onStatus('Generando speaking...'); ai = await genSpeaking(params, n); }
    } catch (e) {
      console.error('Local AI failed for', skill, e);
    }
    result.push(...ai, ...fromBank(skill, ai.length));
  }
  return result;
}
