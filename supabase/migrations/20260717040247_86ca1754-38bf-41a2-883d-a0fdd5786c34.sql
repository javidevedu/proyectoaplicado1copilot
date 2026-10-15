
-- Scope quizzes/questions/attempts/answers to their owning admin
DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
CREATE POLICY "Admins manage their own quizzes"
  ON public.quizzes FOR ALL
  USING (public.has_role(auth.uid(), 'admin') AND created_by = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND created_by = auth.uid());

DROP POLICY IF EXISTS "Admins can manage questions" ON public.questions;
CREATE POLICY "Admins manage questions of their own quizzes"
  ON public.questions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = questions.quiz_id AND q.created_by = auth.uid() AND public.has_role(auth.uid(), 'admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = questions.quiz_id AND q.created_by = auth.uid() AND public.has_role(auth.uid(), 'admin')));

DROP POLICY IF EXISTS "Admins can view all attempts" ON public.attempts;
CREATE POLICY "Admins view attempts of their own quizzes"
  ON public.attempts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = attempts.quiz_id AND q.created_by = auth.uid() AND public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Admins update attempts of their own quizzes"
  ON public.attempts FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = attempts.quiz_id AND q.created_by = auth.uid() AND public.has_role(auth.uid(), 'admin')));

DROP POLICY IF EXISTS "Admins can view all answers" ON public.answers;
CREATE POLICY "Admins view answers of their own quizzes"
  ON public.answers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.attempts a
    JOIN public.quizzes q ON q.id = a.quiz_id
    WHERE a.id = answers.attempt_id AND q.created_by = auth.uid() AND public.has_role(auth.uid(), 'admin')
  ));
