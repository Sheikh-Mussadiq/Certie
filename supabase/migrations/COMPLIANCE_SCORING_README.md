# Property Compliance Scoring System

This migration implements an automated compliance scoring system for properties based on logbook entry completion rates over the last 6 months.

## Files

- `20251001124218_add_property_compliance_scoring.sql` - Main migration file
- `COMPLIANCE_SCORING_README.md` - This documentation file

## How It Works

### Scoring Algorithm

1. **Time Window**: Looks at the last 6 months from current date
2. **Expected Entries**: Calculates how many logbook entries should have been completed based on each logbook's frequency
3. **Actual Entries**: Counts completed entries in the time window
4. **Score Calculation**: `(total_completed ÷ total_due) × 100`
5. **Perfect Score**: If no entries were due in the period, score = 100%

### Frequency Mapping (6 months)

| Frequency | Expected Entries |
|-----------|------------------|
| Daily | 180 entries |
| Weekly | 24 entries |
| Monthly | 6 entries |
| Quarterly | 2 entries |
| Every 6 months | 1 entry |
| Annually | 1 entry (if logbook is old enough) |
| Every 2+ years | 1 entry (if due in period) |

### Smart Due Date Detection

For longer-term frequencies (Annual, Every 2 years, etc.), the system checks:
- When the logbook was created
- Whether an entry would actually be due in the 6-month window
- Only counts entries as "due" if they should have occurred

## Functions Created

### `get_expected_entries_count(frequency, months_back)`
Calculates expected entries for a given frequency over a time period.

### `calculate_property_compliance_score(property_id)`
Calculates compliance score for a specific property. Returns integer 0-100.

### `update_property_compliance_score()`
Trigger function that automatically updates scores when logbook entries change.

### `recalculate_all_compliance_scores()`
Utility function to recalculate all property scores (useful for maintenance).

## Automatic Updates

The system includes a trigger on `logbook_entries` that automatically:
- Recalculates the property's compliance score
- Updates the `properties.compliance_score` column
- Triggers on INSERT, UPDATE, and DELETE operations

## Usage

### Apply Migration
```bash
supabase db push
```

### Manual Score Recalculation
```sql
SELECT recalculate_all_compliance_scores();
```

### Check Individual Property Score
```sql
SELECT calculate_property_compliance_score('your-property-uuid-here');
```

### View All Property Scores
```sql
SELECT name, compliance_score FROM properties ORDER BY compliance_score DESC;
```

## Testing

The migration includes automatic testing and setup for your existing properties.

## Examples

### Property with Perfect Compliance
- Weekly alarm test: 24 due, 24 done = 100%
- Monthly inspection: 6 due, 6 done = 100%
- **Overall Score**: 100%

### Property with Partial Compliance
- Weekly alarm test: 24 due, 20 done = 83.3%
- Monthly inspection: 6 due, 5 done = 83.3%
- Quarterly review: 2 due, 1 done = 50%
- **Total**: (20+5+1) ÷ (24+6+2) = 26÷32 = 81%

### Property with No Due Entries
- All logbooks are new or have very long frequencies
- **Score**: 100% (perfect by default)

## Maintenance

- Scores are automatically maintained via triggers
- Run `recalculate_all_compliance_scores()` if you suspect data inconsistencies
- The system handles edge cases like deleted logbooks and inactive logbooks

## Notes

- Scores are capped between 0 and 100
- Only active logbooks are considered
- Completed entries are capped at expected entries (can't exceed 100% for any logbook)
- The `compliance_score` column in properties table already existed and is reused
