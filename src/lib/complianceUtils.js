// Utility functions for calculating compliance scores on the frontend

/**
 * Calculate expected entries for a logbook based on its frequency over a time period
 */
export const getExpectedEntriesCount = (frequency, days = 30) => {
  switch (frequency) {
    case 'Daily':
      return days;
    case 'Weekly':
      return Math.ceil(days / 7);
    case 'Monthly':
      return Math.ceil(days / 30);
    case 'Quarterly':
      return Math.ceil(days / 90);
    case 'Every 6 months':
      return days >= 180 ? 1 : 0;
    case 'Annually':
      return days >= 365 ? 1 : 0;
    case 'Every 2 years':
      return days >= 730 ? 1 : 0;
    case 'Every 3 years':
      return days >= 1095 ? 1 : 0;
    case 'Every 5 years':
      return days >= 1825 ? 1 : 0;
    default:
      return 0;
  }
};

/**
 * Calculate compliance score for properties within a specific time period
 */
export const calculateComplianceForPeriod = (properties, logbooks, startDate, endDate) => {
  if (!properties.length || !logbooks.length) return 0;

  let totalDue = 0;
  let totalCompleted = 0;
  const periodDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Group logbooks by property
  const logbooksByProperty = logbooks.reduce((acc, logbook) => {
    if (!acc[logbook.property_id]) {
      acc[logbook.property_id] = [];
    }
    acc[logbook.property_id].push(logbook);
    return acc;
  }, {});

  properties.forEach(property => {
    const propertyLogbooks = logbooksByProperty[property.id] || [];
    
    propertyLogbooks.forEach(logbook => {
      if (!logbook.active) return;

      // Calculate expected entries for this period
      const expectedEntries = getExpectedEntriesCount(logbook.frequency, periodDays);
      
      // Count completed entries in this period
      const completedEntries = logbook.logbook_entries 
        ? logbook.logbook_entries.filter(entry => {
            const entryDate = new Date(entry.performed_at);
            return entryDate >= startDate && entryDate <= endDate;
          }).length
        : 0;

      totalDue += expectedEntries;
      totalCompleted += Math.min(completedEntries, expectedEntries); // Cap at expected
    });
  });

  if (totalDue === 0) return 100; // Perfect score if nothing was due
  return Math.round((totalCompleted / totalDue) * 100);
};

/**
 * Calculate current month vs last month compliance comparison
 */
export const calculateMonthlyComplianceComparison = (properties, logbooks) => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const currentMonthScore = calculateComplianceForPeriod(
    properties, 
    logbooks, 
    startOfCurrentMonth, 
    now
  );

  const lastMonthScore = calculateComplianceForPeriod(
    properties, 
    logbooks, 
    startOfLastMonth, 
    endOfLastMonth
  );

  const difference = currentMonthScore - lastMonthScore;
  const percentageChange = lastMonthScore > 0 ? Math.abs((difference / lastMonthScore) * 100) : 0;

  return {
    currentScore: currentMonthScore,
    lastMonthScore,
    difference,
    percentageChange: Math.round(percentageChange * 10) / 10, // Round to 1 decimal
    isImprovement: difference >= 0
  };
};

/**
 * Calculate overall portfolio compliance score (current implementation)
 */
export const calculateOverallCompliance = (properties) => {
  if (!properties.length) return 0;
  
  const averageScore = properties.reduce(
    (acc, property) => acc + (property.compliance_score || 0),
    0
  ) / properties.length;
  
  return Math.round(averageScore);
};
