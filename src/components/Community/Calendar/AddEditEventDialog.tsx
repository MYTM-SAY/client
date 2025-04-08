'use client'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Event } from '@/types/index'

interface AddEditEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDate: Date | null
  event: Event | null
  onSave: (eventData: Omit<Event, 'id'>) => void
  onDelete: (eventId: string) => void
}

export const AddEditEventDialog = ({
  open,
  onOpenChange,
  initialDate,
  event,
  onSave,
  onDelete,
}: AddEditEventDialogProps) => {
  const [eventData, setEventData] = useState<Omit<Event, 'id'>>({
    title: '',
    date: '',
    time: '',
    description: '',
    color: '#3b82f6',
  })

  // Initialize form when editing an existing event
  useEffect(() => {
    if (event) {
      setEventData({
        title: event.title,
        date: event.date,
        time: event.time || '',
        description: event.description || '',
        color: event.color || '#3b82f6',
      })
    } else if (initialDate) {
      setEventData({
        ...eventData,
        date: format(initialDate, 'yyyy-MM-dd'),
      })
    }
  }, [event, initialDate, open])

  const handleChange = (field: keyof typeof eventData, value: string) => {
    setEventData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (eventData.title && eventData.date) {
      onSave(eventData)
    }
  }

  const handleDelete = () => {
    if (event) {
      onDelete(event.id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 text-white border-neutral-700 max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={eventData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={eventData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time (optional)</Label>
            <Input
              id="time"
              value={eventData.time}
              placeholder="e.g. 1pm, 14:30"
              onChange={(e) => handleChange('time', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={eventData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex space-x-2">
              {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => handleChange('color', color)}
                    className={cn(
                      'w-6 h-6 rounded-full',
                      eventData.color === color && 'ring-2 ring-white',
                    )}
                    style={{ backgroundColor: color }}
                  />
                ),
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {event && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!eventData.title || !eventData.date}
            >
              {event ? 'Update' : 'Save'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
