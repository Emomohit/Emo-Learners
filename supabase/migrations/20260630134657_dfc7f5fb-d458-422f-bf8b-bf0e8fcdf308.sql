
-- Revoke EXECUTE from public/anon/authenticated on internal trigger functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_admin_for_founder() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role needs to be callable by authenticated (used in RLS USING clauses).
-- Keep EXECUTE for authenticated but revoke from anon and public.
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;

-- Storage RLS for the study-materials bucket
-- Public read of file objects via signed URLs is server-mediated; we still allow authenticated reads.
CREATE POLICY "study_materials_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'study-materials');
CREATE POLICY "study_materials_admin_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'study-materials' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "study_materials_admin_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'study-materials' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'study-materials' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "study_materials_admin_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'study-materials' AND public.has_role(auth.uid(), 'admin'));
