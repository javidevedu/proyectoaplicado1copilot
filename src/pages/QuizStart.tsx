import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicQuizClient } from '@/integrations/supabase/publicQuizClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import { DataTreatmentDisclosure } from '@/components/DataTreatmentDisclosure';

export default function QuizStart() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Tables<'quizzes'> | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (quizId) fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    const [quizRes, countRes] = await Promise.all([
      publicQuizClient.from('quizzes').select('*').eq('id', quizId!).eq('is_published', true).single(),
      publicQuizClient.from('questions').select('id', { count: 'exact', head: true }).eq('quiz_id', quizId!),
    ]);
    if (quizRes.data) setQuiz(quizRes.data);
    if (countRes.count) setQuestionCount(countRes.count);
    setLoading(false);
  };

  const startQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !classCode.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setStarting(true);

    // No auth needed - RLS allows anon inserts
    const { data, error } = await publicQuizClient.from('attempts').insert({
      quiz_id: quizId!,
      student_name: studentName.trim(),
      student_id: classCode.trim(),
      total_questions: questionCount,
    }).select().single();

    if (error || !data) {
      toast.error('Error starting quiz');
      setStarting(false);
      return;
    }

    navigate(`/quiz/${quizId}/take/${data.id}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

  if (!quiz) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Quiz not found or not published.</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg glass-card">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-heading">{quiz.title}</CardTitle>
          <CardDescription>
            {quiz.target_audience} • Level {quiz.mcer_level}
          </CardDescription>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">{questionCount} questions</Badge>
            {quiz.time_limit_minutes && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {quiz.time_limit_minutes} min
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={startQuiz} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label>Class code (if you don't have one, enter "1")</Label>
              <Input value={classCode} onChange={e => setClassCode(e.target.value)} placeholder="e.g. 1" required />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={starting}>
              {starting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <BookOpen className="w-4 h-4 mr-2" />}
              Start Quiz
            </Button>
          </form>
          <div className="mt-4">
            <DataTreatmentDisclosure />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
