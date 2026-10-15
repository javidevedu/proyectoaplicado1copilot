
-- Quizzes: separar visibilidad pública (estudiantes anon) del acceso de docentes
DROP POLICY IF EXISTS "Anyone can view published quizzes" ON public.quizzes;
CREATE POLICY "Anon can view published quizzes"
  ON public.quizzes FOR SELECT TO anon
  USING (is_published = true);

-- Questions: solo estudiantes anon ven preguntas de quizzes publicados
DROP POLICY IF EXISTS "Anyone can view questions of published quizzes" ON public.questions;
CREATE POLICY "Anon can view questions of published quizzes"
  ON public.questions FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = questions.quiz_id AND q.is_published = true));

-- Attempts: estudiantes anon crean/leen/actualizan; docentes autenticados solo por RLS de propietario
DROP POLICY IF EXISTS "Anyone can view their own attempt" ON public.attempts;
DROP POLICY IF EXISTS "Anyone can update their own attempt" ON public.attempts;
DROP POLICY IF EXISTS "Anyone can create attempts" ON public.attempts;
CREATE POLICY "Anon can create attempts"
  ON public.attempts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can view attempts"
  ON public.attempts FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can update attempts"
  ON public.attempts FOR UPDATE TO anon USING (true);

-- Answers: mismo patrón
DROP POLICY IF EXISTS "Anyone can view their own answers" ON public.answers;
DROP POLICY IF EXISTS "Anyone can insert answers" ON public.answers;
CREATE POLICY "Anon can insert answers"
  ON public.answers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can view answers"
  ON public.answers FOR SELECT TO anon USING (true);
