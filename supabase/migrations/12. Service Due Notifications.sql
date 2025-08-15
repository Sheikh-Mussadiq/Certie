-- 12. Service Due Notifications.sql
-- Adds recurring service due notification logic (cron + function + enum + column + notification type)

-- 1. Enum for service recurring periods
DO $$ BEGIN
  CREATE TYPE public.service_recurring_period AS ENUM ('annual','half_year','monthly');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Add column to services if not exists
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS recurring_period public.service_recurring_period NULL;

COMMENT ON COLUMN public.services.recurring_period IS 'Recurring period for service maintenance schedule.';

-- 3. Add new notification type value 'service_due'
DO $$ BEGIN
  ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'service_due';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. Function to compute and insert due notifications
CREATE OR REPLACE FUNCTION public.run_service_due_notifications()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inserted INTEGER := 0;
BEGIN
  WITH latest_bookings AS (
    SELECT b.property_id,
           b.service_id,
           COALESCE(b.assessment_time, b.created_at)::date AS last_assessment_date,
           ROW_NUMBER() OVER (PARTITION BY b.property_id, b.service_id ORDER BY COALESCE(b.assessment_time, b.created_at) DESC) AS rn
    FROM public.bookings b
    WHERE b.status = 'completed' AND b.service_id IS NOT NULL
  ), due AS (
    SELECT lb.property_id,
           lb.service_id,
           s.name AS service_name,
           p.owner_id,
           p.name AS property_name,
           CASE s.recurring_period
             WHEN 'annual' THEN (lb.last_assessment_date + INTERVAL '12 months')::date
             WHEN 'half_year' THEN (lb.last_assessment_date + INTERVAL '6 months')::date
             WHEN 'monthly' THEN (lb.last_assessment_date + INTERVAL '1 month')::date
           END AS next_due_date
    FROM latest_bookings lb
    JOIN public.services s ON s.id = lb.service_id
    JOIN public.properties p ON p.id = lb.property_id
    WHERE lb.rn = 1 AND s.recurring_period IS NOT NULL
  ), notify AS (
    SELECT d.*, (d.next_due_date - CURRENT_DATE) AS days_remaining
    FROM due d
    WHERE (d.next_due_date - CURRENT_DATE) IN (7,1)
  ), inserted AS (
    SELECT public.create_notification(
             n.owner_id,
             'service_due',
             'Upcoming Service Due',
             'Your ' || n.service_name || ' for ' || n.property_name || ' is due in ' || n.days_remaining || ' days.',
             'services', n.service_id,
             jsonb_build_object(
               'service_id', n.service_id,
               'property_id', n.property_id,
               'service_name', n.service_name,
               'property_name', n.property_name,
               'due_date', n.next_due_date,
               'days_remaining', n.days_remaining
             ),
             NULL,
             NULL,
             CASE WHEN n.days_remaining = 1 THEN 2 ELSE 1 END, -- priority higher when 1 day left
             ARRAY['in_app']
           ) AS notification_id
    FROM notify n
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notifications ex
       WHERE ex.user_id = n.owner_id
         AND ex.type = 'service_due'
         AND ex.entity_type = 'services'
         AND ex.entity_id = n.service_id
         AND ex.meta->>'due_date' = n.next_due_date::text
         AND ex.meta->>'days_remaining' = n.days_remaining::text
    )
  )
  SELECT count(*) INTO v_inserted FROM inserted;

  RETURN v_inserted;
END; $$;

COMMENT ON FUNCTION public.run_service_due_notifications IS 'Generates service due notifications (7-day and 1-day reminders). Returns count inserted.';

-- 5. Grant execute to authenticated (optional) and service roles
GRANT EXECUTE ON FUNCTION public.run_service_due_notifications() TO authenticated; -- remove if you want only service role

-- 6. Unique partial index to prevent duplicates (defense in depth)
CREATE UNIQUE INDEX IF NOT EXISTS notifications_service_due_unique
  ON public.notifications (user_id, entity_id, (meta->>'due_date'), (meta->>'days_remaining'))
  WHERE type = 'service_due' AND entity_type = 'services';

-- 7. Ensure pg_cron extension is enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 8. Schedule daily cron job at 04:10 UTC
-- (Adjust schedule as needed; format: minute hour day month dow)
SELECT cron.schedule(
  'service_due_notifications_daily',
  '0 0 * * *',
  $$SELECT public.run_service_due_notifications();$$
) WHERE NOT EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'service_due_notifications_daily'
);

-- END
