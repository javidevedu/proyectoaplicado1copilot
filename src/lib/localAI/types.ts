export type QType = 'multiple_choice' | 'listening' | 'writing' | 'speaking' | 'fill_blank';

export interface GeneratedQuestion {
  type: QType;
  question_text: string;
  option_a?: string | null;
  option_b?: string | null;
  option_c?: string | null;
  option_d?: string | null;
  correct_answer: string;
  audio_script?: string | null;
}

export interface GenerateParams {
  mcer_level: string;
  target_audience: string;
  topics: string; // comma-separated
  skills: string[];
  num_questions: number;
  writing_word_limit: number;
}

export type Band = 'basic' | 'intermediate' | 'advanced';

export function bandFor(level: string): Band {
  if (level === 'A1' || level === 'A2') return 'basic';
  if (level === 'B1' || level === 'B2') return 'intermediate';
  return 'advanced';
}

/** Evenly split total questions across skills (first skills get the remainder). */
export function distribute(total: number, skills: string[]): Record<string, number> {
  const t = Math.min(20, Math.max(10, total || 14));
  const out: Record<string, number> = {};
  if (skills.length === 0) return out;
  const base = Math.floor(t / skills.length);
  let rem = t % skills.length;
  for (const s of skills) {
    out[s] = base + (rem > 0 ? 1 : 0);
    if (rem > 0) rem--;
  }
  return out;
}

export function parseTopics(topics: string): string[] {
  return topics.split(',').map((t) => t.trim()).filter(Boolean);
}
