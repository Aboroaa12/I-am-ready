/*
  # Fix Access Codes Insert Policy

  1. Security Updates
    - Add INSERT policy for authenticated users on access_codes table
    - Ensure authenticated users can create access codes
    - Maintain existing security for other operations

  2. Changes
    - Add policy "Authenticated users can insert access_codes" for INSERT operations
    - Allow authenticated users to insert access codes without restrictions
*/

-- Add INSERT policy for authenticated users
CREATE POLICY "Authenticated users can insert access_codes"
  ON access_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);