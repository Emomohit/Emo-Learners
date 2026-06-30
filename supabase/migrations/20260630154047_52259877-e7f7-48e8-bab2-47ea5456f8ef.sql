DROP POLICY IF EXISTS "study_materials_read" ON storage.objects;
CREATE POLICY "study_materials_read"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'study-materials');