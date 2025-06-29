-- Create subjects table if it doesn't exist
CREATE TABLE IF NOT EXISTS subjects (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_en text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  description text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- Enable RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subjects' AND policyname = 'Anyone can read subjects') THEN
    DROP POLICY "Anyone can read subjects" ON subjects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subjects' AND policyname = 'Authenticated users can insert subjects') THEN
    DROP POLICY "Authenticated users can insert subjects" ON subjects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subjects' AND policyname = 'Authenticated users can update subjects') THEN
    DROP POLICY "Authenticated users can update subjects" ON subjects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subjects' AND policyname = 'Authenticated users can delete subjects') THEN
    DROP POLICY "Authenticated users can delete subjects" ON subjects;
  END IF;
END $$;

-- Create policies
CREATE POLICY "Anyone can read subjects"
  ON subjects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert subjects"
  ON subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update subjects"
  ON subjects
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete subjects"
  ON subjects
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default subjects
INSERT INTO subjects (id, name, name_en, icon, color, description, is_active, created_at) VALUES
  ('english', 'اللغة الإنجليزية', 'English', '📚', 'from-blue-500 to-indigo-600', 'تعلم اللغة الإنجليزية من خلال المفردات والقواعد والتمارين التفاعلية', true, now()),
  ('math', 'الرياضيات', 'Mathematics', '🔢', 'from-green-500 to-teal-600', 'تعلم الرياضيات من خلال المسائل والتمارين التفاعلية', true, now()),
  ('science', 'العلوم', 'Science', '🔬', 'from-purple-500 to-violet-600', 'تعلم العلوم من خلال التجارب والمفاهيم العلمية', true, now()),
  ('islamic', 'التربية الإسلامية', 'Islamic Education', '☪️', 'from-emerald-500 to-green-600', 'تعلم التربية الإسلامية من خلال القرآن والحديث والفقه', true, now()),
  ('arabic', 'اللغة العربية', 'Arabic', '📖', 'from-amber-500 to-yellow-600', 'تعلم اللغة العربية من خلال القراءة والكتابة والقواعد', true, now())
ON CONFLICT (id) DO NOTHING;