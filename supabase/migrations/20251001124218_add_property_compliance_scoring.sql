-- Migration: Property Compliance Scoring System
-- This migration creates functions to calculate property compliance scores based on logbook entries
-- over the last 6 months and triggers to update scores when entries are added/modified

-- Function to calculate expected entries for a logbook based on its frequency over the last 6 months
CREATE OR REPLACE FUNCTION get_expected_entries_count(frequency_value logbook_frequency, months_back integer DEFAULT 6)
RETURNS integer AS $$
BEGIN
    CASE frequency_value
        WHEN 'Daily' THEN 
            RETURN months_back * 30; -- Approximately 180 entries for 6 months
        WHEN 'Weekly' THEN 
            RETURN months_back * 4; -- Approximately 26 entries for 6 months  
        WHEN 'Monthly' THEN 
            RETURN months_back; -- 6 entries for 6 months
        WHEN 'Quarterly' THEN 
            RETURN CEIL(months_back::decimal / 3); -- 2 entries for 6 months
        WHEN 'Every 6 months' THEN 
            RETURN 1; -- 1 entry for 6 months
        WHEN 'Annually' THEN 
            -- Check if due in the last 6 months (due every 12 months)
            RETURN CASE WHEN months_back >= 6 THEN 1 ELSE 0 END;
        WHEN 'Every 2 years' THEN 
            -- Only due if we're in a period where it should occur
            RETURN 0; -- Typically not due in 6 months, will be handled specially
        WHEN 'Every 3 years' THEN 
            RETURN 0; -- Typically not due in 6 months, will be handled specially
        WHEN 'Every 5 years' THEN 
            RETURN 0; -- Typically not due in 6 months, will be handled specially
        ELSE 
            RETURN 0;
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate compliance score for a specific property
CREATE OR REPLACE FUNCTION calculate_property_compliance_score(property_id_param uuid)
RETURNS integer AS $$
DECLARE
    total_due integer := 0;
    total_completed integer := 0;
    logbook_record RECORD;
    expected_entries integer;
    completed_entries integer;
    six_months_ago date := (CURRENT_DATE - INTERVAL '6 months')::date;
    compliance_score integer;
BEGIN
    -- Loop through all active logbooks for the property
    FOR logbook_record IN 
        SELECT id, frequency, created_at
        FROM property_logbooks 
        WHERE property_id = property_id_param 
        AND active = true
    LOOP
        -- Get expected entries for this logbook
        expected_entries := get_expected_entries_count(logbook_record.frequency);
        
        -- For longer-term logbooks, check if any entries were actually due in the period
        IF logbook_record.frequency IN ('Every 2 years', 'Every 3 years', 'Every 5 years', 'Annually') THEN
            -- For annual and longer frequencies, we need to check if the logbook was created 
            -- long enough ago that an entry would be due in our 6-month window
            CASE 
                WHEN logbook_record.frequency = 'Annually' THEN
                    -- Due if logbook is older than 6 months
                    IF logbook_record.created_at::date <= six_months_ago THEN
                        expected_entries := 1;
                    END IF;
                WHEN logbook_record.frequency = 'Every 2 years' THEN
                    -- Due if logbook is older than 1.5 years (18 months)
                    IF logbook_record.created_at::date <= (CURRENT_DATE - INTERVAL '18 months')::date THEN
                        expected_entries := 1;
                    END IF;
                WHEN logbook_record.frequency = 'Every 3 years' THEN
                    -- Due if logbook is older than 2.5 years
                    IF logbook_record.created_at::date <= (CURRENT_DATE - INTERVAL '30 months')::date THEN
                        expected_entries := 1;
                    END IF;
                WHEN logbook_record.frequency = 'Every 5 years' THEN
                    -- Due if logbook is older than 4.5 years
                    IF logbook_record.created_at::date <= (CURRENT_DATE - INTERVAL '54 months')::date THEN
                        expected_entries := 1;
                    END IF;
            END CASE;
        END IF;
        
        -- Count completed entries in the last 6 months for this logbook
        SELECT COUNT(*)
        INTO completed_entries
        FROM logbook_entries
        WHERE logbook_id = logbook_record.id
        AND performed_at >= six_months_ago;
        
        -- Add to totals
        total_due := total_due + expected_entries;
        total_completed := total_completed + LEAST(completed_entries, expected_entries); -- Cap at expected
    END LOOP;
    
    -- Calculate final score
    IF total_due = 0 THEN
        -- If no entries were due, perfect score
        compliance_score := 100;
    ELSE
        -- Calculate percentage: (completed / due) * 100
        compliance_score := ROUND((total_completed::decimal / total_due::decimal) * 100)::integer;
    END IF;
    
    -- Ensure score is within valid range
    compliance_score := GREATEST(0, LEAST(100, compliance_score));
    
    RETURN compliance_score;
END;
$$ LANGUAGE plpgsql;

-- Function to update property compliance score (triggered function)
CREATE OR REPLACE FUNCTION update_property_compliance_score()
RETURNS trigger AS $$
DECLARE
    target_property_id uuid;
BEGIN
    -- Get the property_id from the logbook entry
    SELECT pl.property_id
    INTO target_property_id
    FROM property_logbooks pl
    WHERE pl.id = COALESCE(NEW.logbook_id, OLD.logbook_id);
    
    -- Update the property's compliance score
    UPDATE properties
    SET compliance_score = calculate_property_compliance_score(target_property_id)
    WHERE id = target_property_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires on logbook_entries changes
DROP TRIGGER IF EXISTS trigger_update_compliance_score ON logbook_entries;
CREATE TRIGGER trigger_update_compliance_score
    AFTER INSERT OR UPDATE OR DELETE ON logbook_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_property_compliance_score();

-- Function to recalculate all property compliance scores (for initial setup or maintenance)
CREATE OR REPLACE FUNCTION recalculate_all_compliance_scores()
RETURNS void AS $$
DECLARE
    property_record RECORD;
BEGIN
    -- Update compliance score for all properties
    FOR property_record IN SELECT id FROM properties
    LOOP
        UPDATE properties
        SET compliance_score = calculate_property_compliance_score(property_record.id)
        WHERE id = property_record.id;
    END LOOP;
    
    RAISE NOTICE 'Recalculated compliance scores for all properties';
END;
$$ LANGUAGE plpgsql;

-- Initial calculation of compliance scores for all existing properties
SELECT recalculate_all_compliance_scores();
