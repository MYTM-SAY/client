import { format, isSameDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Plus, Edit } from 'lucide-react'
import { Event } from '@/types/index'

interface ListViewProps {
  currentDate: Date
  events: Event[]
  onEventClick: (event: Event) => void
  onAddEvent: () => void
}

export const ListView = ({
  currentDate,
  events,
  onEventClick,
  onAddEvent,
}: ListViewProps) => {
  // Group events by date
  const groupEventsByDate = () => {
    const eventsByDate: { [key: string]: Event[] } = {}

    events.forEach((event) => {
      const dateStr = format(new Date(event.date), 'yyyy-MM-dd')
      if (!eventsByDate[dateStr]) {
        eventsByDate[dateStr] = []
      }
      eventsByDate[dateStr].push(event)
    })

    // Convert to array and sort by date
    return Object.entries(eventsByDate)
      .map(([dateStr, dateEvents]) => ({
        date: new Date(dateStr),
        events: dateEvents,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const groupedEvents = groupEventsByDate()
  const today = new Date()

  return (
    <div className="flex flex-col w-full p-4 space-y-4">
      {groupedEvents.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p>No events this month</p>
        </div>
      ) : (
        groupedEvents.map(({ date, events }) => (
          <div key={date.toString()} className="bg-neutral-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <span>{format(date, 'dd/MM/yyyy')}</span>
              {isSameDay(date, today) && (
                <span className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  Today
                </span>
              )}
            </h3>

            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-neutral-700"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: event.color }}
                    ></div>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      {event.time && (
                        <div className="text-sm text-gray-300">
                          {event.time}
                        </div>
                      )}
                      {event.description && (
                        <div className="text-sm text-gray-400 mt-1 line-clamp-1">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEventClick(event)}
                    className="ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <Button
        onClick={onAddEvent}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
