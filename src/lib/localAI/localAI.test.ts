import { describe, it, expect } from 'vitest';
import { distribute } from './types';
import { generateFromBank } from './templateGenerator';
import { computeScore } from './writingGrader';
import { extractJsonArray } from './webllmGenerator';

describe('local AI', () => {
  it('splits 14 questions across 4 skills as 4,4,3,3', () => {
    expect(distribute(14, ['reading', 'writing', 'listening', 'speaking'])).toEqual({ reading: 4, writing: 4, listening: 3, speaking: 3 });
  });

  it('clamps number of questions between 10 and 20', () => {
    expect(Object.values(distribute(50, ['reading'])).reduce((a, b) => a + b)).toBe(20);
    expect(Object.values(distribute(3, ['reading'])).reduce((a, b) => a + b)).toBe(10);
  });

  it('bank generates the exact requested number of questions', () => {
    const qs = generateFromBank({ mcer_level: 'B1', target_audience: 'university', topics: 'Simple Past, Passive Voice', skills: ['reading', 'writing', 'listening', 'speaking'], num_questions: 14, writing_word_limit: 100 });
    expect(qs).toHaveLength(14);
  });

  it('invalid AI output yields no questions (bank fallback)', () => {
    expect(extractJsonArray('sorry, I cannot')).toEqual([]);
  });

  it('empty writing scores 0', () => {
    expect(computeScore(0, 100, 0, 0, 0, 2)).toBe(0);
  });
});
