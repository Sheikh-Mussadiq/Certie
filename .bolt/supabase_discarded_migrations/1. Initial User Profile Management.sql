-- Users Table
CREATE TABLE users (
  id uuid default auth.uid() references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  role TEXT default 'site_user' CHECK (role IN ('super_admin', 'property_owner', 'property_manager', 'site_user'))
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Super Admin Full Access
-- Super Admin Select Access
CREATE POLICY "Super Admin Select Access" ON users
FOR SELECT TO authenticated USING (is_user_role('super_admin'));

-- Super Admin Update Access
CREATE POLICY "Super Admin Update Access" ON users
FOR UPDATE TO authenticated USING (is_user_role('super_admin'))
WITH CHECK (is_user_role('super_admin'));

-- Super Admin Delete Access
CREATE POLICY "Super Admin Delete Access" ON users
FOR DELETE TO authenticated USING (is_user_role('super_admin'));


-- Users can read their own profile
CREATE POLICY "User Read Access" ON users
FOR SELECT TO authenticated USING (id = (select auth.uid()));

-- Users can update their own profile (except role)
CREATE POLICY "User Update Access" ON users
FOR UPDATE TO authenticated USING (id = (select auth.uid()))
WITH CHECK (id = (select auth.uid()));


-- Users can insert their own profile with auto defaults
CREATE POLICY "Users can insert own profile" ON users
FOR INSERT 
To authenticated
WITH CHECK ((select auth.uid()) = id);


CREATE OR REPLACE FUNCTION prevent_email_role_id_change()
RETURNS trigger 
SET search_path TO public
AS $$
BEGIN
  -- Allow internal system calls to bypass
  IF current_setting('app.allow_role_update', true) IS NOT NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.email IS DISTINCT FROM OLD.email OR
     NEW.role IS DISTINCT FROM OLD.role OR
     NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'You cannot change id, email, or role';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER block_sensitive_field_changes
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION prevent_email_role_id_change();



-- 1) Create a helper function that pulls the JWT‐claim email
--    and forces role = 'site_user'
create or replace function public.set_user_email_and_role()
  returns trigger
  language plpgsql
  security definer 
  SET search_path TO public  -- runs with function owner’s rights
as $$
begin
  -- pull the email from the JWT claims that PostgREST / Supabase makes available
  NEW.id := auth.uid();
  NEW.email := auth.jwt() ->> 'email';
  -- force the role column
  new.role  := 'site_user';
  return new;
end;
$$;

-- 2) Attach that function as a trigger to users
create trigger users_before_insert
  before insert on public.users
  for each row
  execute procedure public.set_user_email_and_role();
