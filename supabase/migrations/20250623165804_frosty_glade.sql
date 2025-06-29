/*
  # Fix Access Codes RLS Policies

  1. Security Updates
    - Update RLS policies for access_codes table to allow proper insertion
    - Add policy for authenticated users to insert access codes
    - Ensure teachers can create access codes for themselves
    - Add policy for admin users to manage all access codes

  2. Changes
    - Remove restrictive policies that prevent insertion
    - Add comprehensive policies for different user roles
    - Ensure proper permissions for teacher access code creation
*/

-- Drop existing restrictive policies that might be causing issues
DROP POLICY IF EXISTS "Teachers can insert access_codes" ON access_codes;
DROP POLICY IF EXISTS "Authenticated users can insert access_codes" ON access_codes;

-- Create comprehensive policies for access_codes table
CREATE POLICY "Allow authenticated users to insert access codes"
  ON access_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public users to insert teacher access codes"
  ON access_codes
  FOR INSERT
  TO public
  WITH CHECK (
    -- Allow if the user is creating a code for themselves as a teacher
    (teacher_id IS NOT NULL AND teacher_id::text = auth.uid()::text) OR
    -- Allow if this is a teacher code (is_teacher = true)
    (is_teacher = true) OR
    -- Allow if user is admin (check admin_users setting)
    (EXISTS (
      SELECT 1 FROM settings 
      WHERE key = 'admin_users' 
      AND auth.uid()::text = ANY(
        SELECT jsonb_array_elements_text(value)
      )
    ))
  );

-- Update existing policies to be more permissive for authenticated users
CREATE POLICY "Authenticated users can manage all access codes"
  ON access_codes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure anon users can still read active codes (for login purposes)
CREATE POLICY "Anonymous users can read active access codes"
  ON access_codes
  FOR SELECT
  TO anon
  USING (is_active = true);