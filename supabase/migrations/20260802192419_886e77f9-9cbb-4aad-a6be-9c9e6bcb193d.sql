-- 1) has_role must be SECURITY DEFINER so RLS policies that call it are not
--    themselves subject to the caller's RLS on user_roles (recursion / bypass risk).
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- 2) Defense in depth: the anon role currently holds full CRUD privileges on every
--    public table and is stopped only by RLS. Remove privileges wherever no policy
--    grants anon anything, so RLS is no longer the single point of failure.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;

-- subjects is the only intentionally world-readable catalog (subjects_public_read).
GRANT SELECT ON public.subjects TO anon;

-- Reassert intended privileges for the app roles.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Future tables must not silently hand privileges back to anon.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;

-- 3) Durable, server-side throttle store for the email-less password reset flow.
CREATE TABLE IF NOT EXISTS public.password_reset_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_lc text NOT NULL,
  ip text,
  succeeded boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS password_reset_attempts_email_idx
  ON public.password_reset_attempts (email_lc, created_at DESC);
CREATE INDEX IF NOT EXISTS password_reset_attempts_ip_idx
  ON public.password_reset_attempts (ip, created_at DESC);

-- Only backend (service role) may touch this table: no anon, no authenticated.
GRANT ALL ON public.password_reset_attempts TO service_role;

ALTER TABLE public.password_reset_attempts ENABLE ROW LEVEL SECURITY;

-- No policy for anon/authenticated => locked to everyone but service_role.
CREATE POLICY "password_reset_attempts_service_only"
  ON public.password_reset_attempts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);