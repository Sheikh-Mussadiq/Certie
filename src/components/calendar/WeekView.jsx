const WeekView = ({ currentDate }) => {
  const getWeekDays = (date) => {
    const days = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    
    return days
  }

  const weekDays = getWeekDays(currentDate)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-8 border-b border-grey-outline">
        <div className="w-20" /> {/* Time column */}
        {weekDays.map(day => (
          <div
            key={day.toISOString()}
            className="py-2 text-center"
          >
            <div className="text-sm font-medium text-primary-grey">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="text-sm text-primary-black">
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="relative grid grid-cols-8">
        <div className="w-20"> {/* Time column */}
          {hours.map(hour => (
            <div
              key={hour}
              className="h-12 border-b border-grey-outline text-xs text-primary-grey pr-2 text-right"
            >
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>
        
        {weekDays.map(day => (
          <div
            key={day.toISOString()}
            className="border-l border-grey-outline"
          >
            {hours.map(hour => (
              <div
                key={hour}
                className="h-12 border-b border-grey-outline"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}