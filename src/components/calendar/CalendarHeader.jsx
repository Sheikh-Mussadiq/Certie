import { ChevronLeft, ChevronRight } from 'lucide-react'

const CalendarHeader = ({ currentDate, view, onViewChange, onPrevious, onNext, onToday }) => {
  const formatDate = () => {
    const options = { month: 'long', year: 'numeric' }
    if (view === 'day') {
      options.day = 'numeric'
    }
    return currentDate.toLocaleDateString('en-US', options)
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-grey-outline">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">{formatDate()}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="p-1 hover:bg-grey-fill rounded-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="p-1 hover:bg-grey-fill rounded-md transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToday}
          className="px-4 py-2 text-sm font-medium text-primary-black hover:bg-grey-fill rounded-lg transition-colors"
        >
          Today
        </button>
        
        <div className="flex rounded-lg border border-grey-outline overflow-hidden">
          {['Month', 'Week', 'Day'].map((viewOption) => (
            <button
              key={viewOption}
              onClick={() => onViewChange(viewOption.toLowerCase())}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                view === viewOption.toLowerCase()
                  ? 'bg-primary-orange text-white'
                  : 'text-primary-black hover:bg-grey-fill'
              }`}
            >
              {viewOption}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarHeader