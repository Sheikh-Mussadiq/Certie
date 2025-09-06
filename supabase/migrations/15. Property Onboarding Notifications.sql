-- First add the new notification types
DO $$ BEGIN
    ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'property_onboarding_docs';
    ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'property_onboarding_logbooks';
    ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'property_onboarding_team';
    ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'property_onboarding_assessments';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Create a function to handle new property onboarding notifications
CREATE OR REPLACE FUNCTION handle_new_property_onboarding()
RETURNS TRIGGER AS $$
DECLARE
    existing_property_count INTEGER;
BEGIN
    -- Check if user already has other properties
    SELECT COUNT(*)
    INTO existing_property_count
    FROM properties
    WHERE owner_id = NEW.owner_id
    AND id != NEW.id;  -- Exclude the newly inserted property

    -- Only proceed with notifications if this is the user's first property
    IF existing_property_count = 0 THEN
        -- Documents notification
    INSERT INTO notifications (
        user_id,
        type,
        title,
        body,
        entity_type,
        entity_id,
        meta,
        action_url,
        priority
    ) VALUES (
        NEW.owner_id,
        'property_onboarding_docs',
        'Upload Property Documents',
        'Please upload your property''s existing documents to maintain a complete documentation history.',
        'property',
        NEW.id,
        jsonb_build_object(
            'property_name', NEW.name,
            'property_id', NEW.id,
            'step', 'documents'
        ),
        '/properties/' || NEW.id || '/documents',
        1
    );

    -- Logbooks notification
    INSERT INTO notifications (
        user_id,
        type,
        title,
        body,
        entity_type,
        entity_id,
        meta,
        action_url,
        priority
    ) VALUES (
        NEW.owner_id,
        'property_onboarding_logbooks',
        'Configure Property Logbooks',
        'Set up your property logbooks and add historical entries to maintain compliance records.',
        'property',
        NEW.id,
        jsonb_build_object(
            'property_name', NEW.name,
            'property_id', NEW.id,
            'step', 'logbooks'
        ),
        '/properties/' || NEW.id || '/logbooks',
        1
    );

    -- Team notification
    INSERT INTO notifications (
        user_id,
        type,
        title,
        body,
        entity_type,
        entity_id,
        meta,
        action_url,
        priority
    ) VALUES (
        NEW.owner_id,
        'property_onboarding_team',
        'Assign Property Team',
        'Assign managers and site users to your property through the Edit Property button.',
        'property',
        NEW.id,
        jsonb_build_object(
            'property_name', NEW.name,
            'property_id', NEW.id,
            'step', 'team'
        ),
        '/properties/' || NEW.id || '/settings',
        1
    );

    -- Assessments notification
    INSERT INTO notifications (
        user_id,
        type,
        title,
        body,
        entity_type,
        entity_id,
        meta,
        action_url,
        priority
    ) VALUES (
        NEW.owner_id,
        'property_onboarding_assessments',
        'Schedule Property Assessments',
        'Book new assessments for your property to ensure compliance with regulations.',
        'property',
        NEW.id,
        jsonb_build_object(
            'property_name', NEW.name,
            'property_id', NEW.id,
            'step', 'assessments'
        ),
        '/properties/' || NEW.id || '/assessments',
        1
    );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS trigger_property_onboarding ON properties;
CREATE TRIGGER trigger_property_onboarding
    AFTER INSERT ON properties
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_property_onboarding();