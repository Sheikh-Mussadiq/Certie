-- 14. Logbook Due Notifications.sql
-- Generates notifications one day before a logbook entry is due based on frequency.
-- Threshold: 1 day only. Active logbooks only. Entity type: 'property_logbooks'.

-- Function: run_logbook_due_notifications
CREATE OR REPLACE FUNCTION public.run_logbook_due_notifications()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inserted INTEGER := 0;
BEGIN
  WITH latest AS (
    SELECT pl.id AS logbook_id,
           pl.property_id,
           pl.logbook_type,
           pl.frequency,
           pl.active,
           pl.created_at::date AS created_date,
           (SELECT max(le.performed_at) FROM public.logbook_entries le WHERE le.logbook_id = pl.id) AS last_performed_at
    FROM public.property_logbooks pl
    WHERE pl.active = true
  ), baseline AS (
    SELECT l.*, COALESCE(l.last_performed_at, l.created_date) AS last_date
    FROM latest l
  ), schedule AS (
    SELECT b.*, (
      CASE b.frequency
        WHEN 'Daily' THEN b.last_date + INTERVAL '1 day'
        WHEN 'Weekly' THEN b.last_date + INTERVAL '1 week'
        WHEN 'Monthly' THEN b.last_date + INTERVAL '1 month'
        WHEN 'Quarterly' THEN b.last_date + INTERVAL '3 months'
        WHEN 'Annually' THEN b.last_date + INTERVAL '12 months'
        WHEN 'Every 6 months' THEN b.last_date + INTERVAL '6 months'
        WHEN 'Every 2 years' THEN b.last_date + INTERVAL '24 months'
        WHEN 'Every 3 years' THEN b.last_date + INTERVAL '36 months'
        WHEN 'Every 5 years' THEN b.last_date + INTERVAL '60 months'
      END
    )::date AS next_due_date
    FROM baseline b
  ), due AS (
    SELECT s.*, (s.next_due_date - CURRENT_DATE) AS days_remaining
    FROM schedule s
    WHERE (s.next_due_date - CURRENT_DATE) = 1
  ), expanded AS (
    SELECT d.logbook_id, d.property_id, d.logbook_type, d.frequency, d.next_due_date, psu.user_id, d.days_remaining
    FROM due d
    JOIN public.property_site_users psu ON psu.property_id = d.property_id
  ), enriched AS (
    SELECT e.*, p.name AS property_name
    FROM expanded e
    JOIN public.properties p ON p.id = e.property_id
  ), inserted AS (
    SELECT public.create_notification(
             e.user_id,
             'logbook_due'::public.notification_type,
             'Logbook Task Due Tomorrow',
             ('The ' || e.logbook_type || ' logbook for ' || e.property_name || ' is due tomorrow.')::text,
             'property_logbooks',
             e.logbook_id,
             jsonb_build_object(
               'logbook_id', e.logbook_id,
               'logbook_type', e.logbook_type,
               'property_id', e.property_id,
               'property_name', e.property_name,
               'frequency', e.frequency,
               'due_date', e.next_due_date,
               'days_remaining', e.days_remaining
             )
           ) AS notification_id
    FROM enriched e
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notifications n
       WHERE n.user_id = e.user_id
         AND n.type = 'logbook_due'
         AND n.entity_type = 'property_logbooks'
         AND n.entity_id = e.logbook_id
         AND n.meta->>'due_date' = e.next_due_date::text
    )
  )
  SELECT count(*) INTO v_inserted FROM inserted;

  RETURN v_inserted;
END; $$;

COMMENT ON FUNCTION public.run_logbook_due_notifications IS 'Generates 1-day prior logbook due notifications (includes logbook_type) for site users.';

GRANT EXECUTE ON FUNCTION public.run_logbook_due_notifications() TO authenticated;

-- Unique partial index to enforce no duplicates for a given due date
CREATE UNIQUE INDEX IF NOT EXISTS notifications_logbook_due_unique
  ON public.notifications (user_id, entity_id, (meta->>'due_date'))
  WHERE type = 'logbook_due' AND entity_type = 'property_logbooks';

-- Schedule daily cron (05:05 UTC)
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule(
  'logbook_due_notifications_daily',
  '0 0 * * *',
  $$SELECT public.run_logbook_due_notifications();$$
) WHERE NOT EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'logbook_due_notifications_daily'
);

-- END