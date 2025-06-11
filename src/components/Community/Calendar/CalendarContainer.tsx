'use client'
import { useState } from 'react'
import {
  format,
  isToday,
  isSameMonth,
  getDaysInMonth,
  getDay,
  addMonths,
  subMonths,
} from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MonthView } from './MonthView'
import { ListView } from './ListView'
import { EventDialog } from './EventDialog'
import { AddEditEventDialog } from './AddEditEventDialog'
import { Event } from '@/types/index'

// Initial events data
const initialEvents: Event[] = [
  {
    id: '1',
    title: 'zoom Call',
    date: '2024-11-07',
    time: '1pm',
    color: '#3b82f6', // blue
  },
  {
    id: '2',
    title: 'zoom Call',
    date: '2024-11-13',
    time: '1pm',
    color: '#3b82f6', // blue
  },
  {
    id: '3',
    title: 'zoom Call',
    date: '2024-11-26',
    time: '1pm',
    color: '#3b82f6', // blue
  },
]

export const CalendarContainer = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [view, setView] = useState<'month' | 'list'>('month')
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showAddEditEventDialog, setShowAddEditEventDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  // Handle navigation
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  // Handle day selection
  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
    setShowEventDialog(true)
  }

  // Handle add event
  const handleAddEvent = (day: Date) => {
    setSelectedDay(day)
    setEditingEvent(null)
    setShowAddEditEventDialog(true)
  }

  // Handle edit event
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowAddEditEventDialog(true)
  }

  // Save event (new or edited)
  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      // Update existing event
      setEvents(
        events.map((e) =>
          e.id === editingEvent.id ? { ...eventData, id: editingEvent.id } : e,
        ),
      )
    } else {
      // Add new event
      const newEvent = {
        ...eventData,
        id: Date.now().toString(),
      }
      setEvents([...events, newEvent])
    }
    setShowAddEditEventDialog(false)
    setEditingEvent(null)
  }

  // Delete event
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId))
    setShowAddEditEventDialog(false)
    setEditingEvent(null)
  }

  return (
    <div className="flex flex-col bg-neutral-900 text-white rounded-lg shadow overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 bg-neutral-800">
        <Button
          variant="outline"
          onClick={goToToday}
          className="bg-indigo-600 hover:bg-indigo-700 border-none text-white"
        >
          Today
        </Button>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={previousMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="ghost" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center bg-indigo-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-2',
              view === 'list' ? 'bg-indigo-600' : 'hover:bg-indigo-700',
            )}
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => setView('month')}
            className={cn(
              'p-2',
              view === 'month' ? 'bg-indigo-600' : 'hover:bg-indigo-700',
            )}
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1">
        {view === 'month' ? (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDayClick={handleDayClick}
          />
        ) : (
          <ListView
            date={currentDate}
            events={events.filter((event) =>
              isSameMonth(new Date(event.date), currentDate),
            )}
            onEventClick={(event) => {
              setEditingEvent(event)
              setShowAddEditEventDialog(true)
            }}
            onAddEvent={() => {
              setEditingEvent(null)
              setShowAddEditEventDialog(true)
            }}
          />
        )}
      </div>

      {/* Event Details Dialog */}
      <EventDialog
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
        selectedDay={selectedDay}
        events={events.filter(
          (event) =>
            selectedDay &&
            new Date(event.date).toDateString() === selectedDay.toDateString(),
        )}
        onAddEvent={() => {
          setShowEventDialog(false)
          if (selectedDay) {
            handleAddEvent(selectedDay)
          }
        }}
        onEditEvent={handleEditEvent}
      />

      {/* Add/Edit Event Dialog */}
      <AddEditEventDialog
        open={showAddEditEventDialog}
        onOpenChange={setShowAddEditEventDialog}
        initialDate={selectedDay}
        event={editingEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  )
}
