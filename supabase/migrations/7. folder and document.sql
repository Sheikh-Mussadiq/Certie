/*
  # Documents Management System

  1. New Tables
    - `document_folders`
      - `id` (uuid, primary key)
      - `name` (text, folder name)
      - `property_id` (uuid, reference to properties)
      - `created_at` (timestamptz)
      - `created_by` (uuid, reference to users)
      
    - `documents`
      - `id` (uuid, primary key)
      - `name` (text, document name)
      - `folder_id` (uuid, reference to document_folders)
      - `property_id` (uuid, reference to properties)
      - `file_path` (text, storage path)
      - `file_size` (bigint)
      - `file_type` (text)
      - `created_at` (timestamptz)
      - `created_by` (uuid, reference to users)

  2. Security
    - Enable RLS on both tables
    - Add policies for property owners and managers
*/

-- Create documents bucket
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('documents', 'documents')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Document Folders Table
CREATE TABLE document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(property_id, name)
);

-- Documents Table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  folder_id UUID REFERENCES document_folders(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Document Folders Policies
CREATE POLICY "Property owners can manage folders"
  ON document_folders
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE id = property_id
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Property managers can manage folders"
  ON document_folders
  USING (
    EXISTS (
      SELECT 1 FROM property_managers
      WHERE property_id = document_folders.property_id
      AND user_id = auth.uid()
    )
  );

-- Documents Policies
CREATE POLICY "Property owners can manage documents"
  ON documents
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE id = property_id
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Property managers can manage documents"
  ON documents
  USING (
    EXISTS (
      SELECT 1 FROM property_managers
      WHERE property_id = documents.property_id
      AND user_id = auth.uid()
    )
  );

-- Storage Policies
CREATE POLICY "Users can upload property documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update property documents"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete property documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Property documents are accessible to authorized users"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');