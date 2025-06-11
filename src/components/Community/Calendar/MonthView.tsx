import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns'
import { cn } from '@/lib/utils'
import { Event } from '@/types/index'

interface MonthViewProps {
  currentDate: Date
  events: Event[]
  onDayClick: (day: Date) => void
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const MonthView = ({
  currentDate,
  events,
  onDayClick,
}: MonthViewProps) => {
  // Generate calendar days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Calculate padding days for the start of the month
  const firstDayOfMonthIndex =
    monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), day))
  }

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-7 bg-neutral-800 text-white">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="p-4 text-center font-medium border-r border-neutral-700 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1">
        {/* Empty cells for padding at the start of the month */}
        {Array.from({ length: firstDayOfMonthIndex }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="p-2 border border-neutral-700 bg-neutral-900 min-h-24"
          ></div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentDay = isToday(day)
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <div
              key={day.toString()}
              onClick={() => onDayClick(day)}
              className={cn(
                'p-2 border border-neutral-700 bg-neutral-900 min-h-24 cursor-pointer relative overflow-hidden',
                isCurrentDay && 'bg-neutral-800',
                !isCurrentMonth && 'opacity-50',
              )}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    'font-bold text-lg',
                    isCurrentDay &&
                      'rounded-full bg-green-600 text-white w-8 h-8 flex items-center justify-center',
                  )}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* Day events with overflow hidden */}
              <div className="mt-1 space-y-1 max-h-16 overflow-hidden">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-sm truncate"
                    style={{ color: event.color }}
                  >
                    {event.time && `${event.time} - `}
                    {event.title}
                  </div>
                ))}

                {/* Show indicator if there are more events than visible */}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-400 italic">
                    + {dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
