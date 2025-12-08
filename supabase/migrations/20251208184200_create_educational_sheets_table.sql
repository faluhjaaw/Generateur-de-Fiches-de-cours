/*
  # Create educational sheets table

  1. New Tables
    - `educational_sheets`
      - `id` (uuid, primary key)
      - `niveau` (text) - Level (CI, CP, CE1, etc.)
      - `activite` (text) - Activity (grammaire, mathématiques, etc.)
      - `lecon` (text) - Lesson name
      - `objectif_specifique` (text) - Specific objective
      - `duree` (text) - Duration (30mn, 1h, etc.)
      - `competence_base` (text, nullable) - Basic competence
      - `infos_supplementaires` (text, nullable) - Additional information
      - `generated_content` (jsonb) - Generated sheet content
      - `language` (text) - Language (fr or ar)
      - `created_at` (timestamptz) - Creation timestamp
      
  2. Security
    - Enable RLS on `educational_sheets` table
    - Add policy for anyone to insert and read sheets (public access)
*/

CREATE TABLE IF NOT EXISTS educational_sheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  niveau text NOT NULL,
  activite text NOT NULL,
  lecon text NOT NULL,
  objectif_specifique text NOT NULL,
  duree text NOT NULL,
  competence_base text,
  infos_supplementaires text,
  generated_content jsonb NOT NULL,
  language text NOT NULL DEFAULT 'fr',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE educational_sheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert educational sheets"
  ON educational_sheets
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view educational sheets"
  ON educational_sheets
  FOR SELECT
  TO anon
  USING (true);