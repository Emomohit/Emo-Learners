
-- 1) pyq_papers
CREATE TABLE public.pyq_papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  year int,
  storage_path text NOT NULL,
  page_count int,
  status text NOT NULL DEFAULT 'uploaded',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pyq_papers TO authenticated;
GRANT ALL ON public.pyq_papers TO service_role;
ALTER TABLE public.pyq_papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own pyq_papers" ON public.pyq_papers FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2) pyq_analyses
CREATE TABLE public.pyq_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  paper_ids uuid[] NOT NULL DEFAULT '{}',
  weightage jsonb NOT NULL DEFAULT '[]'::jsonb,
  topic_freq jsonb NOT NULL DEFAULT '[]'::jsonb,
  year_trend jsonb NOT NULL DEFAULT '[]'::jsonb,
  summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pyq_analyses TO authenticated;
GRANT ALL ON public.pyq_analyses TO service_role;
ALTER TABLE public.pyq_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own pyq_analyses" ON public.pyq_analyses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3) predicted_questions
CREATE TABLE public.predicted_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id uuid NOT NULL REFERENCES public.pyq_analyses(id) ON DELETE CASCADE,
  question text NOT NULL,
  probability numeric NOT NULL DEFAULT 0,
  unit text,
  marks int,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.predicted_questions TO authenticated;
GRANT ALL ON public.predicted_questions TO service_role;
ALTER TABLE public.predicted_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own predicted_questions" ON public.predicted_questions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4) study_plans
CREATE TABLE public.study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  days_left int NOT NULL DEFAULT 7,
  mode text NOT NULL DEFAULT 'normal',
  plan jsonb NOT NULL DEFAULT '{}'::jsonb,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_plans TO authenticated;
GRANT ALL ON public.study_plans TO service_role;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own study_plans" ON public.study_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER study_plans_updated BEFORE UPDATE ON public.study_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) emoiq_weak_topics
CREATE TABLE public.emoiq_weak_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  topic text NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, subject, topic)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.emoiq_weak_topics TO authenticated;
GRANT ALL ON public.emoiq_weak_topics TO service_role;
ALTER TABLE public.emoiq_weak_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own weak topics" ON public.emoiq_weak_topics FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6) emoiq_quiz_attempts
CREATE TABLE public.emoiq_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  topics text[] NOT NULL DEFAULT '{}',
  score int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 0,
  details jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.emoiq_quiz_attempts TO authenticated;
GRANT ALL ON public.emoiq_quiz_attempts TO service_role;
ALTER TABLE public.emoiq_quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own quiz attempts" ON public.emoiq_quiz_attempts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 7) emoiq_doubt_threads + messages
CREATE TABLE public.emoiq_doubt_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New chat',
  subject text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.emoiq_doubt_threads TO authenticated;
GRANT ALL ON public.emoiq_doubt_threads TO service_role;
ALTER TABLE public.emoiq_doubt_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own doubt threads" ON public.emoiq_doubt_threads FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER emoiq_doubt_threads_updated BEFORE UPDATE ON public.emoiq_doubt_threads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.emoiq_doubt_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.emoiq_doubt_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.emoiq_doubt_messages TO authenticated;
GRANT ALL ON public.emoiq_doubt_messages TO service_role;
ALTER TABLE public.emoiq_doubt_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own doubt messages" ON public.emoiq_doubt_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Storage policies for pyq-papers bucket (bucket created via tool)
CREATE POLICY "emoiq own read pyq" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'pyq-papers' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "emoiq own write pyq" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'pyq-papers' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "emoiq own delete pyq" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'pyq-papers' AND (storage.foldername(name))[1] = auth.uid()::text);
