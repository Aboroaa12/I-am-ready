/*
  # Fix Teachers Table RLS Policies

  1. Security
    - Safely drop and recreate policies for the teachers table
    - Add policies for authenticated and anonymous users
    - Ensure teachers can manage their own data
*/

-- First check if policies exist before dropping them
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Authenticated users can insert teachers') THEN
    DROP POLICY "Authenticated users can insert teachers" ON teachers;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Authenticated users can read all teachers') THEN
    DROP POLICY "Authenticated users can read all teachers" ON teachers;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Authenticated users can update all teachers') THEN
    DROP POLICY "Authenticated users can update all teachers" ON teachers;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Teachers can read their own data') THEN
    DROP POLICY "Teachers can read their own data" ON teachers;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Teachers can update their own data') THEN
    DROP POLICY "Teachers can update their own data" ON teachers;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Enable all operations for authenticated users') THEN
    DROP POLICY "Enable all operations for authenticated users" ON teachers;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Allow anonymous insert for initial setup') THEN
    DROP POLICY "Allow anonymous insert for initial setup" ON teachers;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Allow anonymous read for initial setup') THEN
    DROP POLICY "Allow anonymous read for initial setup" ON teachers;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Allow anonymous update for initial setup') THEN
    DROP POLICY "Allow anonymous update for initial setup" ON teachers;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Teachers can manage their own data') THEN
    DROP POLICY "Teachers can manage their own data" ON teachers;
  END IF;
END $$;

-- Create new policies with proper permissions
CREATE POLICY "Enable all operations for authenticated users"
  ON teachers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to insert teachers (for initial admin setup)
CREATE POLICY "Allow anonymous insert for initial setup"
  ON teachers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to read teachers (for initial setup)
CREATE POLICY "Allow anonymous read for initial setup"
  ON teachers
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to update teachers (for initial setup)
CREATE POLICY "Allow anonymous update for initial setup"
  ON teachers
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow teachers to manage their own data when they have a proper session
CREATE POLICY "Teachers can manage their own data"
  ON teachers
  FOR ALL
  TO public
  USING ((auth.uid())::text = (id)::text)
  WITH CHECK ((auth.uid())::text = (id)::text);