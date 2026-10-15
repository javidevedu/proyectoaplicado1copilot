import { useEffect, useState, type ReactNode } from 'react';
import { publicQuizClient } from '@/integrations/supabase/publicQuizClient';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, PenLine, Mic, Loader2, BookOpen, Headphones } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Question = Tables<'questions'>;

interface WritingFeedback {
  spelling_errors: { word: string; correction: string; context: string }[];
  grammar_errors: { error: string; correction: string; context: string }[];
  topics_used: string[];
  topics_missing: string[];
  overall_score: number;
  feedback: string;
}

interface QuizResultsProps {
  questions: Question[];
  answers: Record<string, string>;
  attemptId: string;
  scorableCorrect: number;
  scorableTotal: number;
}

export default function QuizResults({ questions, answers, attemptId, scorableCorrect, scorableTotal }: QuizResultsProps) {
  const [writingFeedbacks, setWritingFeedbacks] = useState<Record<string, WritingFeedback | null>>({});
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  const writingQs = questions.filter(q => q.type === 'writing');
  const speakingQs = questions.filter(q => q.type === 'speaking');
  const readingQs = questions.filter(q => q.type === 'multiple_choice');
  const listeningQs = questions.filter(q => q.type === 'listening');
  const fillBlankQs = questions.filter(q => q.type === 'fill_blank');

  const getOptionText = (q: Question, letter: string) => {
    if (!letter) return '';
    const key = `option_${letter.toLowerCase()}` as keyof Question;
    return (q[key] as string | null) || '';
  };

  const isAnswerCorrect = (q: Question, studentAnswer: string) => {
    if (q.type === 'fill_blank') {
      return studentAnswer.trim().toLowerCase() === (q.correct_answer || '').trim().toLowerCase();
    }
    return studentAnswer === q.correct_answer;
  };

  const getStudentDisplay = (q: Question, studentAnswer: string) => {
    if (!studentAnswer) return 'No answer provided';
    if (q.type === 'fill_blank') return studentAnswer;
    const optionText = getOptionText(q, studentAnswer);
    return optionText ? `${studentAnswer}) ${optionText}` : studentAnswer;
  };

  const getCorrectDisplay = (q: Question) => {
    if (q.type === 'fill_blank') return q.correct_answer || 'No answer';
    const correctLetter = q.correct_answer || '';
    const optionText = getOptionText(q, correctLetter);
    return optionText ? `${correctLetter}) ${optionText}` : correctLetter || 'No answer';
  };

  // Poll for writing feedback
  useEffect(() => {
    if (writingQs.length === 0) {
      setLoadingFeedback(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 40; // ~2 minutes total
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      try {
        const { data } = await publicQuizClient
          .from('answers')
          .select('question_id, writing_feedback')
          .eq('attempt_id', attemptId)
          .in('question_id', writingQs.map(q => q.id));

        if (data) {
          const feedbacks: Record<string, WritingFeedback | null> = {};
          let allDone = true;
          for (const row of data) {
            if (row.writing_feedback) {
              feedbacks[row.question_id] = row.writing_feedback as unknown as WritingFeedback;
            } else {
              allDone = false;
              feedbacks[row.question_id] = null;
            }
          }
          setWritingFeedbacks(feedbacks);
          if (allDone || attempts >= maxAttempts) {
            setLoadingFeedback(false);
            return;
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
      attempts++;
      if (!cancelled) setTimeout(poll, 3000);
    };

    poll();
    return () => { cancelled = true; };
  }, [attemptId]);

  const percentage = scorableTotal > 0 ? Math.round((scorableCorrect / scorableTotal) * 100) : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Overall Score — no detail breakdown */}
        <Card>
          <CardContent className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 mx-auto text-primary" />
            <h2 className="text-2xl font-heading font-bold">Quiz Completed!</h2>
            <div className="text-5xl font-heading font-bold text-primary">
              {scorableCorrect}<span className="text-2xl text-muted-foreground">/{scorableTotal}</span>
            </div>
            <p className="text-muted-foreground">{percentage}% correct</p>
            <p className="text-xs text-muted-foreground italic">
              Review your reading, listening, and fill-in-the-blank answers below. Writing and speaking are reviewed separately by your teacher.
            </p>
          </CardContent>
        </Card>

        {readingQs.length > 0 && (
          <QuestionReviewSection
            icon={<BookOpen className="w-4 h-4 text-primary" />}
            title="Reading"
            questions={readingQs}
            answers={answers}
            isCorrect={isAnswerCorrect}
            getStudentText={getStudentDisplay}
            getCorrectText={getCorrectDisplay}
          />
        )}

        {fillBlankQs.length > 0 && (
          <QuestionReviewSection
            icon={<PenLine className="w-4 h-4 text-primary" />}
            title="Fill in the Blank"
            questions={fillBlankQs}
            answers={answers}
            isCorrect={isAnswerCorrect}
            getStudentText={getStudentDisplay}
            getCorrectText={getCorrectDisplay}
          />
        )}

        {listeningQs.length > 0 && (
          <QuestionReviewSection
            icon={<Headphones className="w-4 h-4 text-primary" />}
            title="Listening"
            questions={listeningQs}
            answers={answers}
            isCorrect={isAnswerCorrect}
            getStudentText={getStudentDisplay}
            getCorrectText={getCorrectDisplay}
          />
        )}

        {/* Writing Section — only feedback, no correct answers */}
        {writingQs.length > 0 && (
          <Card>
            <CardContent className="py-6 space-y-4">
              <div className="flex items-center gap-2">
                <PenLine className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-heading font-bold">Writing Feedback</h3>
              </div>
              {writingQs.map(q => {
                const fb = writingFeedbacks[q.id];
                const studentAns = answers[q.id] || '';
                return (
                  <div key={q.id} className="space-y-3 p-4 rounded-lg border border-border">
                    <p className="text-sm font-medium">{q.question_text}</p>
                    <div className="bg-muted/50 rounded p-3">
                      <p className="text-xs text-muted-foreground mb-1 font-semibold">Your text:</p>
                      <p className="text-sm whitespace-pre-wrap">{studentAns || <span className="italic text-muted-foreground">No answer provided</span>}</p>
                    </div>

                    {loadingFeedback && !fb ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Grading your writing... This may take up to 2 minutes.
                      </div>
                    ) : fb ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={fb.overall_score >= 7 ? 'default' : fb.overall_score >= 4 ? 'secondary' : 'destructive'}>
                            Score: {fb.overall_score}/10
                          </Badge>
                        </div>
                        <p className="text-sm">{fb.feedback}</p>

                        {fb.spelling_errors?.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-destructive">Spelling Errors:</p>
                            {fb.spelling_errors.map((e, i) => (
                              <p key={i} className="text-xs text-muted-foreground">
                                "<span className="text-destructive font-medium">{e.word}</span>" → <span className="text-primary font-medium">{e.correction}</span>
                              </p>
                            ))}
                          </div>
                        )}

                        {fb.grammar_errors?.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-destructive">Grammar Errors:</p>
                            {fb.grammar_errors.map((e, i) => (
                              <p key={i} className="text-xs text-muted-foreground">
                                {e.error} → <span className="text-primary font-medium">{e.correction}</span>
                              </p>
                            ))}
                          </div>
                        )}

                        {fb.topics_used?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs font-semibold mr-1">Topics used:</span>
                            {fb.topics_used.map((t, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                            ))}
                          </div>
                        )}
                        {fb.topics_missing?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs font-semibold text-destructive mr-1">Topics missing:</span>
                            {fb.topics_missing.map((t, i) => (
                              <Badge key={i} variant="destructive" className="text-xs">{t}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Feedback could not be generated. Your teacher will review your writing manually.</p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Speaking Notice */}
        {speakingQs.length > 0 && (
          <Card>
            <CardContent className="py-6 space-y-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-heading font-bold">Speaking</h3>
              </div>
              <div className="rounded-lg border-2 border-muted bg-muted/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Speaking is evaluated by your teacher in person and is <strong>not included</strong> in the score above.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function QuestionReviewSection({
  icon,
  title,
  questions,
  answers,
  isCorrect,
  getStudentText,
  getCorrectText,
}: {
  icon: ReactNode;
  title: string;
  questions: Question[];
  answers: Record<string, string>;
  isCorrect: (question: Question, studentAnswer: string) => boolean;
  getStudentText: (question: Question, studentAnswer: string) => string;
  getCorrectText: (question: Question) => string;
}) {
  const correctCount = questions.filter(q => isCorrect(q, answers[q.id] || '')).length;

  return (
    <Card>
      <CardContent className="py-6 space-y-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-heading font-bold">{title}</h3>
          <Badge variant="outline" className="ml-auto text-xs">
            {correctCount}/{questions.length}
          </Badge>
        </div>

        <div className="space-y-3">
          {questions.map(q => {
            const studentAnswer = answers[q.id] || '';
            const correct = isCorrect(q, studentAnswer);
            return (
              <div key={q.id} className={`rounded-lg border p-4 ${correct ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'}`}>
                <div className="flex items-start gap-2">
                  {correct ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />}
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">{q.question_text}</p>
                    <p className="text-xs text-muted-foreground">Your answer: <span className="font-semibold text-foreground">{getStudentText(q, studentAnswer)}</span></p>
                    <p className="text-xs text-primary">Correct answer: <span className="font-semibold">{getCorrectText(q)}</span></p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
