import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CalendarHeader from './CalendarHeader'
import MonthView from './MonthView'
import WeekView from './WeekView'
import DayView from './DayView'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // 'month', 'week', 'day'

  const handlePrevious = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (view === 'month') {
        newDate.setMonth(prev.getMonth() - 1)
      } else if (view === 'week') {
        newDate.setDate(prev.getDate() - 7)
      } else {
        newDate.setDate(prev.getDate() - 1)
      }
      return newDate
    })
  }

  const handleNext = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (view === 'month') {
        newDate.setMonth(prev.getMonth() + 1)
      } else if (view === 'week') {
        newDate.setDate(prev.getDate() + 7)
      } else {
        newDate.setDate(prev.getDate() + 1)
      }
      return newDate
    })
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="h-full bg-white rounded-lg border border-grey-outline overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />
      
      {view === 'month' && <MonthView currentDate={currentDate} />}
      {view === 'week' && <WeekView currentDate={currentDate} />}
      {view === 'day' && <DayView currentDate={currentDate} />}
    </div>
  )
}

export default Calendar