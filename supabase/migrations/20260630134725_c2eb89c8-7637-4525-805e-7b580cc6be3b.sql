
-- Switch has_role to SECURITY INVOKER (relies on user_roles self_read policy)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Tighten public feedback insert to require non-empty fields and sane lengths
DROP POLICY IF EXISTS "feedback_public_insert" ON public.feedback;
CREATE POLICY "feedback_public_insert" ON public.feedback FOR INSERT TO anon, authenticated
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 120
  AND length(trim(email)) BETWEEN 3 AND 200
  AND position('@' in email) > 1
  AND length(trim(message)) BETWEEN 1 AND 4000
);
