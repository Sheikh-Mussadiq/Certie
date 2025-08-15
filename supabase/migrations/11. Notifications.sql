-- 11. Notifications.sql
-- Notification system (Phase 1)
-- Includes:
--  * notification_type enum
--  * notifications table
--  * helper functions (create / mark read / counts)
--  * triggers for automated events (bookings, invoices, documents, property assignments)
--  * RLS policies
--  * Future‑ready columns for email channel (no sending logic yet)

-- 1. Enum type
DO $$ BEGIN
  CREATE TYPE public.notification_type AS ENUM (
    'booking_created',
    'booking_status_changed',
    'invoice_created',
    'document_uploaded',
    'property_assigned',
    'logbook_due',
    'logbook_overdue',
    'service_added',
    'role_changed',
    'generic'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  actor_id UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  type public.notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NULL,
  entity_type TEXT NULL,
  entity_id UUID NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  channels TEXT[] NOT NULL DEFAULT ARRAY['in_app'], -- future: add 'email'
  channel_status JSONB NOT NULL DEFAULT '{}'::jsonb, -- per-channel delivery info {"email": {"sent_at": ts, "attempts": n}}
  email_sent_at TIMESTAMPTZ NULL, -- convenience shortcut
  action_url TEXT NULL, -- deep link (frontend route or external URL)
  priority SMALLINT NOT NULL DEFAULT 0, -- 0=normal, higher=important
  read_at TIMESTAMPTZ NULL,
  expires_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT notifications_entity_ref CHECK (
    (entity_type IS NULL AND entity_id IS NULL) OR (entity_type IS NOT NULL)
  )
);

COMMENT ON TABLE public.notifications IS 'Per-user notifications (in-app + future channels).';
COMMENT ON COLUMN public.notifications.meta IS 'Arbitrary structured payload for client rendering.';

-- 3. Indexes
CREATE INDEX IF NOT EXISTS notifications_user_created_idx ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_unread_idx ON public.notifications (user_id, created_at DESC) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS notifications_entity_idx ON public.notifications (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS notifications_type_idx ON public.notifications (type);

-- Optional dedupe example (commented):
-- CREATE UNIQUE INDEX notifications_unique_booking_status_per_state ON public.notifications (user_id, type, entity_id, (meta->>'status'))
--   WHERE type = 'booking_status_changed';

-- 4. RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ BEGIN
  CREATE POLICY notifications_select_own ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY notifications_update_mark_own ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow insert of self-targeted notifications (optional) – system/service role bypasses RLS anyway.
DO $$ BEGIN
  CREATE POLICY notifications_insert_self ON public.notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. Helper Functions

-- Create a notification; SECURITY DEFINER so triggers (running as table owner) can target other users.
CREATE OR REPLACE FUNCTION public.create_notification(
  recipient UUID,
  p_type public.notification_type,
  p_title TEXT,
  p_body TEXT DEFAULT NULL,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_meta JSONB DEFAULT '{}'::jsonb,
  p_actor UUID DEFAULT NULL,
  p_action_url TEXT DEFAULT NULL,
  p_priority SMALLINT DEFAULT 0,
  p_channels TEXT[] DEFAULT ARRAY['in_app']
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, actor_id, type, title, body, entity_type, entity_id, meta, action_url, priority, channels)
  VALUES (recipient, p_actor, p_type, p_title, p_body, p_entity_type, p_entity_id, COALESCE(p_meta, '{}'::jsonb), p_action_url, p_priority, p_channels)
  RETURNING id INTO v_id;
  RETURN v_id;
END; $$;

COMMENT ON FUNCTION public.create_notification IS 'Insert a notification for a single recipient; returns notification id.';

CREATE OR REPLACE FUNCTION public.mark_notifications_read(p_ids UUID[])
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE public.notifications
    SET read_at = COALESCE(read_at, now())
  WHERE id = ANY(p_ids) AND user_id = auth.uid();
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END; $$;

CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE public.notifications
    SET read_at = COALESCE(read_at, now())
  WHERE user_id = auth.uid() AND read_at IS NULL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END; $$;

CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS INTEGER
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT count(*)::int FROM public.notifications WHERE user_id = auth.uid() AND read_at IS NULL;
$$;

-- 6. Trigger Helper Functions for Automated Events

-- Booking created
CREATE OR REPLACE FUNCTION public.trg_booking_created_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  r_owner UUID;
  r_user UUID;
BEGIN
  -- Notify the user who booked (booked_by) if present
  IF NEW.booked_by IS NOT NULL THEN
    PERFORM public.create_notification(
      NEW.booked_by,
      'booking_created',
      'Booking created',
      'Your booking has been created.',
      'bookings', NEW.id,
      jsonb_build_object('status', NEW.status, 'property_id', NEW.property_id, 'property_name', NEW.property_name)
    );
  END IF;

  -- Notify property owner and managers/site users
  IF NEW.property_id IS NOT NULL THEN
    SELECT owner_id INTO r_owner FROM public.properties WHERE id = NEW.property_id;
    IF r_owner IS NOT NULL AND r_owner IS DISTINCT FROM NEW.booked_by THEN
      PERFORM public.create_notification(
        r_owner,
        'booking_created',
        'New booking for property',
        COALESCE(NEW.property_name, 'A property') || ' received a new booking.',
        'bookings', NEW.id,
        jsonb_build_object('status', NEW.status, 'property_id', NEW.property_id, 'property_name', NEW.property_name)
      );
    END IF;

    -- Managers
    FOR r_user IN
      SELECT user_id FROM public.property_managers WHERE property_id = NEW.property_id
    LOOP
      IF r_user IS DISTINCT FROM NEW.booked_by AND r_user IS DISTINCT FROM r_owner THEN
        PERFORM public.create_notification(
          r_user,
          'booking_created',
          'Property booking created',
          COALESCE(NEW.property_name, 'Property') || ' booking created.',
          'bookings', NEW.id,
          jsonb_build_object('status', NEW.status, 'property_id', NEW.property_id, 'property_name', NEW.property_name)
        );
      END IF;
    END LOOP;

    -- Site users
    FOR r_user IN
      SELECT user_id FROM public.property_site_users WHERE property_id = NEW.property_id
    LOOP
      IF r_user IS DISTINCT FROM NEW.booked_by AND r_user IS DISTINCT FROM r_owner THEN
        PERFORM public.create_notification(
          r_user,
          'booking_created',
          'Property booking created',
          COALESCE(NEW.property_name, 'Property') || ' booking created.',
          'bookings', NEW.id,
          jsonb_build_object('status', NEW.status, 'property_id', NEW.property_id, 'property_name', NEW.property_name)
        );
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END; $$;

-- Booking status change
CREATE OR REPLACE FUNCTION public.trg_booking_status_changed_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.booked_by IS NOT NULL THEN
      PERFORM public.create_notification(
        NEW.booked_by,
        'booking_status_changed',
        'Booking status updated',
        'Status changed from ' || COALESCE(OLD.status::text,'?') || ' to ' || NEW.status::text || '.',
        'bookings', NEW.id,
        jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status, 'property_id', NEW.property_id, 'property_name', NEW.property_name)
      );
    END IF;
  END IF;
  RETURN NEW;
END; $$;

-- Invoice created
CREATE OR REPLACE FUNCTION public.trg_invoice_created_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    PERFORM public.create_notification(
      NEW.user_id,
      'invoice_created',
      'Invoice generated',
      'An invoice has been generated.',
      'invoices', NEW.id,
      jsonb_build_object('amount_due', NEW.amount_due, 'status', NEW.status)
    );
  END IF;
  RETURN NEW;
END; $$;

-- Document uploaded
CREATE OR REPLACE FUNCTION public.trg_document_uploaded_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  r_owner UUID;
  r_user UUID;
BEGIN
  IF NEW.property_id IS NOT NULL THEN
    SELECT owner_id INTO r_owner FROM public.properties WHERE id = NEW.property_id;
    IF r_owner IS NOT NULL THEN
      PERFORM public.create_notification(
        r_owner,
        'document_uploaded',
        'New document uploaded',
        COALESCE(NEW.name,'A document') || ' uploaded.',
        'documents', NEW.id,
        jsonb_build_object('property_id', NEW.property_id, 'file_type', NEW.file_type)
      );
    END IF;
    FOR r_user IN SELECT user_id FROM public.property_managers WHERE property_id = NEW.property_id LOOP
      IF r_user IS DISTINCT FROM r_owner THEN
        PERFORM public.create_notification(
          r_user,
          'document_uploaded',
          'Document uploaded',
          COALESCE(NEW.name,'Document') || ' uploaded.',
          'documents', NEW.id,
          jsonb_build_object('property_id', NEW.property_id, 'file_type', NEW.file_type)
        );
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END; $$;

-- Property manager assignment
CREATE OR REPLACE FUNCTION public.trg_property_manager_assigned_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.create_notification(
    NEW.user_id,
    'property_assigned',
    'Assigned to property',
    'You have been assigned as manager.',
    'properties', NEW.property_id,
    jsonb_build_object('role','manager')
  );
  RETURN NEW;
END; $$;

-- Property site user assignment
CREATE OR REPLACE FUNCTION public.trg_property_site_user_assigned_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.create_notification(
    NEW.user_id,
    'property_assigned',
    'Assigned to property',
    'You have been added as a site user.',
    'properties', NEW.property_id,
    jsonb_build_object('role','site_user')
  );
  RETURN NEW;
END; $$;

-- 7. Attach Triggers (idempotent creation)
DO $$ BEGIN
  CREATE TRIGGER booking_created_notify
    AFTER INSERT ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.trg_booking_created_notify();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER booking_status_changed_notify
    AFTER UPDATE OF status ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.trg_booking_status_changed_notify();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER invoice_created_notify
    AFTER INSERT ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.trg_invoice_created_notify();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER document_uploaded_notify
    AFTER INSERT ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.trg_document_uploaded_notify();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER property_manager_assigned_notify
    AFTER INSERT ON public.property_managers
    FOR EACH ROW EXECUTE FUNCTION public.trg_property_manager_assigned_notify();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER property_site_user_assigned_notify
    AFTER INSERT ON public.property_site_users
    FOR EACH ROW EXECUTE FUNCTION public.trg_property_site_user_assigned_notify();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 8. Convenience grant for authenticated users to execute read functions
GRANT EXECUTE ON FUNCTION public.get_unread_notification_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notifications_read(UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_notification(UUID, public.notification_type, TEXT, TEXT, TEXT, UUID, JSONB, UUID, TEXT, SMALLINT, TEXT[]) TO authenticated;

-- Note: service role automatically bypasses RLS for administrative inserts.

-- END
