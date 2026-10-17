import { describe, it, expect } from 'vitest';
import { distribute } from './types';
import { generateFromBank, skillOf, topicWritingQuestionBank } from './templateGenerator';
import { computeScore } from './writingGrader';
import { extractJsonArray } from './webllmGenerator';
import { ENGLISH_TOPICS } from '@/constants/englishTopics';

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

  it('bank fills the requested count for each skill without loading a model', () => {
    for (const skill of ['reading', 'writing', 'listening', 'speaking']) {
      const questions = generateFromBank({
        mcer_level: 'A2',
        target_audience: 'high_school',
        topics: 'Simple Past, Passive Voice',
        skills: [skill],
        num_questions: 20,
        writing_word_limit: 100,
      });

      expect(questions).toHaveLength(20);
      expect(questions.every((question) => skillOf(question.type) === skill)).toBe(true);
    }
  });

  it('provides five distinct bank questions for every selectable topic', () => {
    for (const topic of ENGLISH_TOPICS) {
      const questions = topicWritingQuestionBank(topic, 'B1', 100);

      expect(questions).toHaveLength(5);
      expect(new Set(questions.map((question) => question.question_text)).size).toBe(5);
      expect(questions.every((question) => question.question_text.includes(topic))).toBe(true);
    }
  });

  it('uses selected topics in generated writing questions', () => {
    const questions = generateFromBank({
      mcer_level: 'B1',
      target_audience: 'university',
      topics: 'Simple Past',
      skills: ['writing'],
      num_questions: 10,
      writing_word_limit: 100,
    });

    expect(questions).toHaveLength(10);
    expect(questions.every((question) => question.question_text.includes('Simple Past'))).toBe(true);
  });

  it('invalid AI output yields no questions (bank fallback)', () => {
    expect(extractJsonArray('sorry, I cannot')).toEqual([]);
  });

  it('empty writing scores 0', () => {
    expect(computeScore(0, 100, 0, 0, 0, 2)).toBe(0);
  });
});
