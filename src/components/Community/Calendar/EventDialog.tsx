import { format } from 'date-fns'
import { Plus, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Event } from '@/types/index'

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDay: Date | null
  events: Event[]
  onAddEvent: () => void
  onEditEvent: (event: Event) => void
}

export const EventDialog = ({
  open,
  onOpenChange,
  selectedDay,
  events,
  onAddEvent,
  onEditEvent,
}: EventDialogProps) => {
  if (!selectedDay) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 text-white border-neutral-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{format(selectedDay, 'MMMM d, yyyy')}</span>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={onAddEvent}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p>No events scheduled for this day</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="p-3 bg-neutral-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: event.color }}
                    ></div>
                    <div className="font-bold">{event.title}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditEvent(event)}
                    className="ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                {event.time && <div className="mt-1 text-sm">{event.time}</div>}
                {event.description && (
                  <div className="mt-2 text-sm">{event.description}</div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
