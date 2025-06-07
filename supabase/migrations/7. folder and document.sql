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
  property_id UUID REFERENCES properties(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(property_id, name)
);

-- Documents Table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  folder_id UUID REFERENCES document_folders(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id),
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view folders"
  ON document_folders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE id = property_id AND owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Managers can view folders"
  ON document_folders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM property_managers
      WHERE property_id = document_folders.property_id AND user_id = (select auth.uid())
    )
  );

CREATE POLICY "Site users can view folders"
  ON document_folders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM property_site_users
      WHERE property_id = document_folders.property_id AND user_id = (select auth.uid())
    )
  );

CREATE POLICY "Super admins can view folders"
  ON document_folders FOR SELECT
  USING (
    is_user_role('super_admin')
  );

CREATE POLICY "Super admins can insert folders"
  ON document_folders FOR INSERT
  WITH CHECK (
    is_user_role('super_admin')
  );

CREATE POLICY "Super admins can update folders"
  ON document_folders FOR UPDATE
  USING (
    is_user_role('super_admin')
  );

CREATE POLICY "Super admins can delete folders"
  ON document_folders FOR DELETE
  USING (
    is_user_role('super_admin')
  );

CREATE POLICY "Owners can view documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE id = property_id AND owner_id = (select auth.uid())
    )
  );

CREATE POLICY "Managers can view documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM property_managers
      WHERE property_id = documents.property_id AND user_id = (select auth.uid())
    )
  );

CREATE POLICY "Site users can view documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM property_site_users
      WHERE property_id = documents.property_id AND user_id = (select auth.uid())
    )
  );

CREATE POLICY "Super admins can view documents"
  ON documents FOR SELECT
  USING (
    is_user_role('super_admin')
  );


CREATE POLICY "Super admins can insert documents"
  ON documents FOR INSERT
  WITH CHECK (
    is_user_role('super_admin')
  );

CREATE POLICY "Super admins can update documents"
  ON documents FOR UPDATE
  USING (
    is_user_role('super_admin')
  );

CREATE POLICY "Super admins can delete documents"
  ON documents FOR DELETE
  USING (
    is_user_role('super_admin')
  );


-- Storage Policies
CREATE POLICY "Users can upload property documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    (select auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update property documents"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    (select auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete property documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
   (select auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Property documents are accessible to authorized users"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');