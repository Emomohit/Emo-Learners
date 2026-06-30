DROP POLICY IF EXISTS "feedback_public_insert" ON public.feedback;

CREATE POLICY "feedback_authenticated_insert"
ON public.feedback
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND email = COALESCE(auth.jwt()->>'email', '')
  AND length(trim(name)) BETWEEN 1 AND 120
  AND length(trim(email)) BETWEEN 3 AND 200
  AND position('@' in email) > 1
  AND length(trim(message)) BETWEEN 1 AND 4000
);