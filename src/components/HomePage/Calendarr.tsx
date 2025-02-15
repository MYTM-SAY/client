"use client";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import Reminders from "./Reminders";

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="overflow-y-auto min-w-[250px] no-scrollbar gap-8 space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      <Reminders />
    </div>
  );
}
