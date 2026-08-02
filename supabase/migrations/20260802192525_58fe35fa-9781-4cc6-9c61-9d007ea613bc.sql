-- The blanket GRANT ... ON ALL TABLES TO authenticated in the previous migration
-- also covered password_reset_attempts. That table is backend-only: revoke it.
REVOKE ALL ON public.password_reset_attempts FROM authenticated;
REVOKE ALL ON public.password_reset_attempts FROM anon;

-- service_role retains ALL (granted previously) for the throttle logic.
GRANT ALL ON public.password_reset_attempts TO service_role;