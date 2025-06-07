# Assessment Management System Documentation

## Overview
The Assessment Management System provides a comprehensive interface for tracking and managing property assessments through integration with the Supabase bookings table. It displays assessment data, tracks completion status, and manages due dates for recurring assessments.

## Architecture

### Database Integration
The system uses the existing `bookings` table from Supabase with the following relevant fields:
- **type**: Assessment type (filtered for assessment-related bookings)
- **completed_at**: Date when assessment was completed
- **status**: Current status of the assessment
- **assignee**: JSONB field containing assessor information
- **attachments**: Array of document attachments
- **property_id**: Reference to the property

### Assessment Status Logic
The system calculates assessment status based on completion dates and due dates:
- **Complete**: Assessment completed and next due date is more than 30 days away
- **Due Soon**: Next due date is within 30 days
- **Overdue**: Next due date has passed
- **Pending**: Assessment not yet completed

## Component Structure

### AssessmentsTab Component
**Location**: `src/components/properties/AssessmentsTab.jsx`

**Purpose**: Main interface for viewing and managing property assessments

**Key Features**:
- Statistics dashboard showing total, overdue, and due soon assessments
- Tabular view of all assessments with detailed information
- Status tracking and visual indicators
- Pagination for large datasets
- Integration with existing booking services

## Data Flow

### 1. Data Fetching
```javascript
const fetchAssessments = async () => {
  const bookingsData = await getPropertyBookings(propertyId);
  const assessmentBookings = bookingsData.filter(booking => 
    booking.type && booking.type.toLowerCase().includes('assessment')
  );
  setAssessments(assessmentBookings);
  calculateStats(assessmentBookings);
};
```

### 2. Status Calculation
```javascript
const getAssessmentStatus = (booking) => {
  if (!booking.completed_at) return booking.status || 'pending';
  
  const completedDate = new Date(booking.completed_at);
  const nextDue = new Date(completedDate);
  nextDue.setFullYear(nextDue.getFullYear() + 1); // Annual assessments
  
  const now = new Date();
  if (nextDue < now) return 'overdue';
  if (nextDue <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) return 'due soon';
  return 'complete';
};
```

### 3. Statistics Calculation
```javascript
const calculateStats = (assessmentData) => {
  const total = assessmentData.length;
  let overdue = 0;
  let nextDueCount = 0;
  
  assessmentData.forEach(assessment => {
    const status = getAssessmentStatus(assessment);
    if (status === 'overdue') overdue++;
    if (status === 'due soon') nextDueCount++;
  });
  
  setStats({ total, overdue, nextDue: nextDueCount });
};
```

## Table Columns

### 1. Assessment Type
- **Source**: `booking.type`
- **Display**: Direct display of the assessment type
- **Example**: "Fire Risk Assessment", "PAT Testing"

### 2. Date Completed
- **Source**: `booking.completed_at`
- **Display**: Formatted date (DD MMM YYYY)
- **Fallback**: "Not completed" if null

### 3. Next Due
- **Source**: Calculated from `completed_at + 1 year`
- **Display**: Formatted date (DD MMM YYYY)
- **Logic**: Annual recurring assessments

### 4. Status
- **Source**: Calculated based on completion and due dates
- **Display**: Color-coded badges
- **Colors**:
  - Green: Complete
  - Orange: Due Soon
  - Red: Overdue
  - Yellow: Pending

### 5. Performed By
- **Source**: `booking.assignee` (JSONB)
- **Display**: 
  - Avatar image if `assignee.avatar` exists
  - Initials (first 2 letters of name) as fallback
  - Name: `assignee.name`
  - Contact: `assignee.contact`

### 6. Document
- **Source**: `booking.attachments`
- **Display**: 
  - "View Document" if attachments exist
  - "Upload Document" if no attachments

### 7. Assessment Time
- **Source**: `assignee.assessment_time`
- **Display**: Formatted date and time
- **Fallback**: "Not scheduled" if null

## Statistics Dashboard

### Metrics Displayed
1. **Total Assessments**: Count of all assessment bookings
2. **Overdue**: Count of assessments past their due date
3. **Due Soon**: Count of assessments due within 30 days

### Visual Indicators
- Large numeric display for each metric
- Trend indicators (percentage change)
- Color coding for positive/negative trends

## User Interactions

### Available Actions
1. **Cancel Assessment**: Delete/cancel an assessment booking
2. **View/Upload Documents**: Access assessment documentation
3. **Sort and Filter**: Organize assessment data
4. **Pagination**: Navigate through large datasets

### Action Handlers
```javascript
const handleDeleteAssessment = async (assessmentId) => {
  await cancelBooking(assessmentId);
  await fetchAssessments(); // Refresh data
  toast.success("Assessment cancelled");
};
```

## Integration with Booking Services

### Service Functions Used
- `getPropertyBookings(propertyId)`: Fetch all bookings for property
- `updateBookingStatus(assessmentId, newStatus)`: Update assessment status
- `cancelBooking(assessmentId)`: Cancel an assessment

### Data Filtering
```javascript
const assessmentBookings = bookingsData.filter(booking => 
  booking.type && booking.type.toLowerCase().includes('assessment')
);
```

## Error Handling

### Common Scenarios
1. **Network Failures**: Toast notifications for failed API calls
2. **Missing Data**: Graceful fallbacks for null/undefined values
3. **Permission Errors**: User-friendly error messages

### User Feedback
- Loading spinners during data fetching
- Toast notifications for success/error states
- Confirmation dialogs for destructive actions

## Performance Considerations

### Optimization Strategies
1. **Efficient Filtering**: Client-side filtering of assessment bookings
2. **Pagination**: Limit displayed items for large datasets
3. **Memoization**: Cache calculated statistics
4. **Lazy Loading**: Load data only when component mounts

### Data Management
- Local state management for assessments and statistics
- Automatic refresh after data modifications
- Optimistic updates for better user experience

## Responsive Design

### Mobile Considerations
- Horizontal scrolling for table on small screens
- Responsive grid layout for statistics cards
- Touch-friendly action buttons

### Accessibility
- Proper ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatible table structure

## Future Enhancements

### Planned Features
1. **Bulk Operations**: Select and update multiple assessments
2. **Advanced Filtering**: Filter by status, type, assignee
3. **Export Functionality**: Export assessment data to CSV/PDF
4. **Calendar Integration**: View assessments in calendar format
5. **Automated Reminders**: Email/SMS notifications for due assessments
6. **Assessment Templates**: Predefined assessment types and schedules
7. **Compliance Tracking**: Track regulatory compliance requirements
8. **Reporting Dashboard**: Advanced analytics and reporting

### Technical Improvements
1. **Real-time Updates**: WebSocket integration for live updates
2. **Offline Support**: Cache data for offline viewing
3. **Advanced Search**: Full-text search across assessment data
4. **Data Visualization**: Charts and graphs for assessment trends
5. **Integration APIs**: Connect with external assessment tools

## Usage Examples

### Fetching Assessments
```javascript
useEffect(() => {
  if (propertyId) {
    fetchAssessments();
  }
}, [propertyId]);
```

### Calculating Next Due Date
```javascript
const getNextDueDate = (completedAt) => {
  if (!completedAt) return "N/A";
  const completedDate = new Date(completedAt);
  const nextDue = new Date(completedDate);
  nextDue.setFullYear(nextDue.getFullYear() + 1);
  return nextDue.toLocaleDateString('en-GB');
};
```

### Displaying Assignee Information
```javascript
const getAssigneeInitials = (assignee) => {
  if (!assignee || !assignee.name) return "N/A";
  return assignee.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
```