ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS academic_year smallint;

CREATE TABLE public.course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_slug text NOT NULL,
  content_item_id integer NOT NULL DEFAULT 1,
  video_id text,
  last_timestamp integer NOT NULL DEFAULT 0,
  completed_items integer[] NOT NULL DEFAULT '{}',
  percentage smallint NOT NULL DEFAULT 0,
  last_watched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT course_progress_user_course_unique UNIQUE (user_id, course_slug),
  CONSTRAINT course_progress_slug_length CHECK (char_length(course_slug) BETWEEN 1 AND 100),
  CONSTRAINT course_progress_content_item_positive CHECK (content_item_id > 0),
  CONSTRAINT course_progress_timestamp_nonnegative CHECK (last_timestamp >= 0),
  CONSTRAINT course_progress_percentage_range CHECK (percentage BETWEEN 0 AND 100)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_progress TO authenticated;
GRANT ALL ON public.course_progress TO service_role;

ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY course_progress_self_read
  ON public.course_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY course_progress_self_insert
  ON public.course_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY course_progress_self_update
  ON public.course_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY course_progress_self_delete
  ON public.course_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER course_progress_set_updated_at
  BEFORE UPDATE ON public.course_progress
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX course_progress_user_last_watched_idx
  ON public.course_progress (user_id, last_watched_at DESC);