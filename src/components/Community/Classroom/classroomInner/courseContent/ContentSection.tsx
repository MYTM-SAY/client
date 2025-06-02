'use client'
import { useState } from 'react'
import React from 'react'
import Lesson from './Lesson'
import { Checkbox } from '@/components/ui/checkbox'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const ContentSection = ({ courseContent, setCourseContent, selectedLesson, setSelectedLesson }: any) => {
  return (
    <Accordion type="single" collapsible defaultValue="section-3">
      {courseContent.map((section: any) => {
        // Calculate the number of completed lessons dynamically
        const completedLessons = section.lessons.filter(
          (lesson: any) => lesson.completed,
        ).length

        return (
          <AccordionItem
            key={section.section}
            value={`section-${section.section}`}
          >
            <AccordionTrigger>
              <div className="flex flex-col items-start gap-2">
                <div className="text-base font-semibold">
                  Section {section.section}: {section.title}
                </div>
                <span className="p-sm-muted">
                  {completedLessons}/{section.lessons.length} |
                  {section.duration} min
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4">
                {section.lessons.map((lesson: any) => (
                  <Lesson
                    key={lesson.id}
                    lesson={lesson}
                    setCourseContent={setCourseContent}
                    courseContent={courseContent}
                    onSelect={() => setSelectedLesson(lesson)}
                    selected={selectedLesson?.id === lesson.id}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default ContentSection
