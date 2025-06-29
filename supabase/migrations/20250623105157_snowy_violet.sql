/*
  # Initial Schema Setup

  1. Tables
    - `health_check` - For connection testing
    - `teachers` - Teacher information
    - `students` - Student information
    - `class_rooms` - Classroom information
    - `access_codes` - Access codes for login
    - `user_progress` - Student progress tracking
    - `achievements` - Student achievements
    - `student_activities` - Student activity logs
    - `vocabulary_words` - Vocabulary words
    - `grammar_rules` - Grammar rules
    - `quiz_questions` - Quiz questions
    - `settings` - System settings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Health Check Table
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial health check record
INSERT INTO health_check (status) VALUES ('ok');

-- Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  grades INTEGER[] NOT NULL,
  students TEXT[] DEFAULT '{}',
  join_date TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  school_name TEXT,
  subjects TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  code_limit INTEGER DEFAULT 20
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grade INTEGER NOT NULL,
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  join_date TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  parent_email TEXT,
  student_number TEXT,
  class_room_ids TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Class Rooms Table
CREATE TABLE IF NOT EXISTS class_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grade INTEGER NOT NULL,
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  last_activity TIMESTAMPTZ,
  subject TEXT
);

-- Access Codes Table
CREATE TABLE IF NOT EXISTS access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  grade INTEGER NOT NULL,
  description TEXT NOT NULL,
  teacher_id UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  max_usage INTEGER,
  student_id UUID REFERENCES students(id),
  class_room_id UUID REFERENCES class_rooms(id),
  teacher_name TEXT,
  teacher_phone TEXT,
  is_teacher BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  total_score INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  units_completed TEXT[] DEFAULT '{}',
  words_learned INTEGER DEFAULT 0,
  last_study_date TIMESTAMPTZ DEFAULT NOW(),
  word_progress JSONB DEFAULT '{}',
  study_sessions JSONB[] DEFAULT '{}',
  total_study_time INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  achievement_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  achieved BOOLEAN DEFAULT FALSE,
  achieved_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Activities Table
CREATE TABLE IF NOT EXISTS student_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  activity_type TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  score INTEGER NOT NULL,
  words_studied TEXT[] DEFAULT '{}',
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_spent INTEGER NOT NULL,
  unit TEXT NOT NULL,
  grade INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vocabulary Words Table
CREATE TABLE IF NOT EXISTS vocabulary_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  english TEXT NOT NULL,
  arabic TEXT NOT NULL,
  unit TEXT NOT NULL,
  pronunciation TEXT,
  grade INTEGER NOT NULL,
  part_of_speech TEXT,
  example_sentence TEXT,
  difficulty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  created_by UUID
);

-- Grammar Rules Table
CREATE TABLE IF NOT EXISTS grammar_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,
  examples TEXT[] NOT NULL,
  unit TEXT NOT NULL,
  grade INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  created_by UUID
);

-- Quiz Questions Table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  unit TEXT NOT NULL,
  grade INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  created_by UUID
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES 
  ('access_code_settings', '{"defaultExpiryDays": 90, "requireExpiry": false, "maxUsagePerCode": 30, "requireDescription": true, "allowTeacherCustomCodes": true}'),
  ('teacher_code_limits', '{"default": 20}');

-- Enable Row Level Security
ALTER TABLE health_check ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for health_check
CREATE POLICY "Anyone can read health_check" ON health_check FOR SELECT USING (true);

-- Create policies for teachers
CREATE POLICY "Teachers can read their own data" ON teachers FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Admins can read all teachers" ON teachers FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "Admins can insert teachers" ON teachers FOR INSERT WITH CHECK (auth.role() = 'admin');
CREATE POLICY "Admins can update teachers" ON teachers FOR UPDATE USING (auth.role() = 'admin');
CREATE POLICY "Teachers can update their own data" ON teachers FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for students
CREATE POLICY "Teachers can read their students" ON students FOR SELECT USING (teacher_id::text = auth.uid()::text);
CREATE POLICY "Admins can read all students" ON students FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "Teachers can insert students" ON students FOR INSERT WITH CHECK (teacher_id::text = auth.uid()::text);
CREATE POLICY "Teachers can update their students" ON students FOR UPDATE USING (teacher_id::text = auth.uid()::text);
CREATE POLICY "Admins can update all students" ON students FOR UPDATE USING (auth.role() = 'admin');

-- Create policies for class_rooms
CREATE POLICY "Teachers can read their class_rooms" ON class_rooms FOR SELECT USING (teacher_id::text = auth.uid()::text);
CREATE POLICY "Admins can read all class_rooms" ON class_rooms FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "Teachers can insert class_rooms" ON class_rooms FOR INSERT WITH CHECK (teacher_id::text = auth.uid()::text);
CREATE POLICY "Teachers can update their class_rooms" ON class_rooms FOR UPDATE USING (teacher_id::text = auth.uid()::text);
CREATE POLICY "Admins can update all class_rooms" ON class_rooms FOR UPDATE USING (auth.role() = 'admin');

-- Create policies for access_codes
CREATE POLICY "Anyone can read active access_codes" ON access_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Teachers can read their access_codes" ON access_codes FOR SELECT USING (teacher_id::text = auth.uid()::text);
CREATE POLICY "Admins can read all access_codes" ON access_codes FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "Teachers can insert access_codes" ON access_codes FOR INSERT WITH CHECK (teacher_id::text = auth.uid()::text);
CREATE POLICY "Teachers can update their access_codes" ON access_codes FOR UPDATE USING (teacher_id::text = auth.uid()::text);
CREATE POLICY "Admins can update all access_codes" ON access_codes FOR UPDATE USING (auth.role() = 'admin');

-- Create policies for user_progress
CREATE POLICY "Students can read their own progress" ON user_progress FOR SELECT USING (student_id::text = auth.uid()::text);
CREATE POLICY "Teachers can read their students' progress" ON user_progress FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Admins can read all progress" ON user_progress FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "Students can update their own progress" ON user_progress FOR UPDATE USING (student_id::text = auth.uid()::text);
CREATE POLICY "Teachers can update their students' progress" ON user_progress FOR UPDATE USING (
  student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Admins can update all progress" ON user_progress FOR UPDATE USING (auth.role() = 'admin');

-- Create policies for achievements
CREATE POLICY "Students can read their own achievements" ON achievements FOR SELECT USING (student_id::text = auth.uid()::text);
CREATE POLICY "Teachers can read their students' achievements" ON achievements FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Admins can read all achievements" ON achievements FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "Students can update their own achievements" ON achievements FOR UPDATE USING (student_id::text = auth.uid()::text);
CREATE POLICY "Teachers can update their students' achievements" ON achievements FOR UPDATE USING (
  student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Admins can update all achievements" ON achievements FOR UPDATE USING (auth.role() = 'admin');

-- Create policies for student_activities
CREATE POLICY "Students can read their own activities" ON student_activities FOR SELECT USING (student_id::text = auth.uid()::text);
CREATE POLICY "Teachers can read their students' activities" ON student_activities FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Admins can read all activities" ON student_activities FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "Students can insert their own activities" ON student_activities FOR INSERT WITH CHECK (student_id::text = auth.uid()::text);
CREATE POLICY "Teachers can insert their students' activities" ON student_activities FOR INSERT WITH CHECK (
  student_id IN (SELECT id FROM students WHERE teacher_id::text = auth.uid()::text)
);
CREATE POLICY "Admins can insert all activities" ON student_activities FOR INSERT WITH CHECK (auth.role() = 'admin');

-- Create policies for vocabulary_words
CREATE POLICY "Anyone can read vocabulary_words" ON vocabulary_words FOR SELECT USING (true);
CREATE POLICY "Admins can insert vocabulary_words" ON vocabulary_words FOR INSERT WITH CHECK (auth.role() = 'admin');
CREATE POLICY "Admins can update vocabulary_words" ON vocabulary_words FOR UPDATE USING (auth.role() = 'admin');
CREATE POLICY "Admins can delete vocabulary_words" ON vocabulary_words FOR DELETE USING (auth.role() = 'admin');

-- Create policies for grammar_rules
CREATE POLICY "Anyone can read grammar_rules" ON grammar_rules FOR SELECT USING (true);
CREATE POLICY "Admins can insert grammar_rules" ON grammar_rules FOR INSERT WITH CHECK (auth.role() = 'admin');
CREATE POLICY "Admins can update grammar_rules" ON grammar_rules FOR UPDATE USING (auth.role() = 'admin');
CREATE POLICY "Admins can delete grammar_rules" ON grammar_rules FOR DELETE USING (auth.role() = 'admin');

-- Create policies for quiz_questions
CREATE POLICY "Anyone can read quiz_questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Admins can insert quiz_questions" ON quiz_questions FOR INSERT WITH CHECK (auth.role() = 'admin');
CREATE POLICY "Admins can update quiz_questions" ON quiz_questions FOR UPDATE USING (auth.role() = 'admin');
CREATE POLICY "Admins can delete quiz_questions" ON quiz_questions FOR DELETE USING (auth.role() = 'admin');

-- Create policies for settings
CREATE POLICY "Anyone can read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert settings" ON settings FOR INSERT WITH CHECK (auth.role() = 'admin');
CREATE POLICY "Admins can update settings" ON settings FOR UPDATE USING (auth.role() = 'admin');