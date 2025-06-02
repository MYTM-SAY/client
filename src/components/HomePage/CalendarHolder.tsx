'use client'
import { Calendar } from '@/components/ui/calendar'
import React from 'react'
// import Reminders from './Reminders'

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="hidden md:block space-y-5 col-span-2 sticky top-10">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border items-center"
      />
      {/* <Reminders /> */}
    </div>
  )
}
