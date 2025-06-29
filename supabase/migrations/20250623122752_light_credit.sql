-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Authenticated users can insert vocabulary_words" ON vocabulary_words;
DROP POLICY IF EXISTS "Teachers can insert vocabulary_words" ON vocabulary_words;
DROP POLICY IF EXISTS "Teachers can insert vocabulary_words for content" ON vocabulary_words;

-- Allow authenticated users to insert vocabulary words (for data seeding)
CREATE POLICY "Authenticated users can insert vocabulary_words"
  ON vocabulary_words
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow teachers to insert vocabulary words for content creation
CREATE POLICY "Teachers can insert vocabulary_words for content"
  ON vocabulary_words
  FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM settings 
        WHERE key = 'admin_users' AND 
        (auth.uid())::text IN (SELECT jsonb_array_elements_text(value))
      ) OR
      EXISTS (
        SELECT 1 FROM teachers 
        WHERE (teachers.id)::text = (auth.uid())::text 
        AND teachers.is_active = true
      )
    )
  );