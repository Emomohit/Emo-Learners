DROP POLICY IF EXISTS "resources_public_read" ON public.resources;

CREATE POLICY "resources_authenticated_read"
ON public.resources
FOR SELECT
TO authenticated
USING (true);