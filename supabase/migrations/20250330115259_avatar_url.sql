-- Create avatars bucket for avatars if it doesn't exist, We keep this Bucket Public as avatars can be accessed publically
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('avatars', 'avatars')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Set up storage policies
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Add avatar_url validation
-- ALTER TABLE public.users
--   ADD CONSTRAINT valid_avatar_url CHECK (
--     avatar_url IS NULL OR 
--     avatar_url ~* '^https?://.*\.(png|jpg|jpeg)$'
--   );

ALTER TABLE public.users
  ADD CONSTRAINT valid_avatar_url CHECK (
    avatar_url IS NULL OR 
    avatar_url ~* '^https?://(.*\.(png|jpg|jpeg)(\?.*)?|ui-avatars\.com/.*|.*\.googleusercontent\.com/.*)$'
  );

-- Update RLS policies for profile updates
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);