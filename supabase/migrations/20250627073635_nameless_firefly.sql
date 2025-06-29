/*
  # Add Subject-Based Content Tables

  1. New Tables
    - `subjects` - Core subjects information
    - `content_items` - Generic content for all subjects
    - `math_problems` - Math-specific problems and exercises
    - `science_experiments` - Science experiments and activities
    - `islamic_content` - Islamic education materials
    - `arabic_content` - Arabic language materials

  2. Schema Updates
    - Add subject field to existing content tables
    - Enable RLS on all new tables
    - Create appropriate policies

  3. Data
    - Insert default subjects
    - Update existing content to use English subject
*/

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Content Items Table
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL,
  subject TEXT NOT NULL REFERENCES subjects(id),
  unit TEXT NOT NULL,
  grade INTEGER NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Math Problems Table
CREATE TABLE IF NOT EXISTS math_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options TEXT[],
  answer TEXT NOT NULL,
  solution TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  topic TEXT NOT NULL,
  unit TEXT NOT NULL,
  grade INTEGER NOT NULL,
  subject TEXT NOT NULL REFERENCES subjects(id),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Science Experiments Table
CREATE TABLE IF NOT EXISTS science_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  objective TEXT NOT NULL,
  materials TEXT[] NOT NULL,
  procedure TEXT[] NOT NULL,
  conclusion TEXT NOT NULL,
  safety_notes TEXT[],
  topic TEXT NOT NULL,
  unit TEXT NOT NULL,
  grade INTEGER NOT NULL,
  subject TEXT NOT NULL REFERENCES subjects(id),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Islamic Education Content Table
CREATE TABLE IF NOT EXISTS islamic_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  arabic_text TEXT NOT NULL,
  translation TEXT,
  explanation TEXT NOT NULL,
  topic TEXT NOT NULL,
  unit TEXT NOT NULL,
  grade INTEGER NOT NULL,
  subject TEXT NOT NULL REFERENCES subjects(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Arabic Language Content Table
CREATE TABLE IF NOT EXISTS arabic_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  explanation TEXT NOT NULL,
  examples TEXT[] NOT NULL,
  exercises JSONB[] NOT NULL,
  topic TEXT NOT NULL,
  unit TEXT NOT NULL,
  grade INTEGER NOT NULL,
  subject TEXT NOT NULL REFERENCES subjects(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Add subject field to existing tables
ALTER TABLE vocabulary_words ADD COLUMN IF NOT EXISTS subject TEXT REFERENCES subjects(id);
ALTER TABLE grammar_rules ADD COLUMN IF NOT EXISTS subject TEXT REFERENCES subjects(id);
ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS subject TEXT REFERENCES subjects(id);
ALTER TABLE student_activities ADD COLUMN IF NOT EXISTS subject TEXT REFERENCES subjects(id);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE math_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE science_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE islamic_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE arabic_content ENABLE ROW LEVEL SECURITY;

-- Create policies for subjects
CREATE POLICY "Anyone can read subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert subjects" ON subjects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update subjects" ON subjects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete subjects" ON subjects FOR DELETE TO authenticated USING (true);

-- Create policies for content_items
CREATE POLICY "Anyone can read content_items" ON content_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert content_items" ON content_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update content_items" ON content_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete content_items" ON content_items FOR DELETE TO authenticated USING (true);

-- Create policies for math_problems
CREATE POLICY "Anyone can read math_problems" ON math_problems FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert math_problems" ON math_problems FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update math_problems" ON math_problems FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete math_problems" ON math_problems FOR DELETE TO authenticated USING (true);

-- Create policies for science_experiments
CREATE POLICY "Anyone can read science_experiments" ON science_experiments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert science_experiments" ON science_experiments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update science_experiments" ON science_experiments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete science_experiments" ON science_experiments FOR DELETE TO authenticated USING (true);

-- Create policies for islamic_content
CREATE POLICY "Anyone can read islamic_content" ON islamic_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert islamic_content" ON islamic_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update islamic_content" ON islamic_content FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete islamic_content" ON islamic_content FOR DELETE TO authenticated USING (true);

-- Create policies for arabic_content
CREATE POLICY "Anyone can read arabic_content" ON arabic_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert arabic_content" ON arabic_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update arabic_content" ON arabic_content FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete arabic_content" ON arabic_content FOR DELETE TO authenticated USING (true);

-- Insert default subjects
INSERT INTO subjects (id, name, name_en, icon, color, description, is_active, created_at)
VALUES
  ('english', 'اللغة الإنجليزية', 'English', '📚', 'from-blue-500 to-indigo-600', 'تعلم اللغة الإنجليزية من خلال المفردات والقواعد والتمارين التفاعلية', true, NOW()),
  ('math', 'الرياضيات', 'Mathematics', '🔢', 'from-green-500 to-teal-600', 'تعلم الرياضيات من خلال المسائل والتمارين التفاعلية', true, NOW()),
  ('science', 'العلوم', 'Science', '🔬', 'from-purple-500 to-violet-600', 'تعلم العلوم من خلال التجارب والمفاهيم العلمية', true, NOW()),
  ('islamic', 'التربية الإسلامية', 'Islamic Education', '☪️', 'from-emerald-500 to-green-600', 'تعلم التربية الإسلامية من خلال القرآن والحديث والفقه', true, NOW()),
  ('arabic', 'اللغة العربية', 'Arabic', '📖', 'from-amber-500 to-yellow-600', 'تعلم اللغة العربية من خلال القراءة والكتابة والقواعد', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Update existing vocabulary words to use the English subject
UPDATE vocabulary_words SET subject = 'english' WHERE subject IS NULL;
UPDATE grammar_rules SET subject = 'english' WHERE subject IS NULL;
UPDATE quiz_questions SET subject = 'english' WHERE subject IS NULL;