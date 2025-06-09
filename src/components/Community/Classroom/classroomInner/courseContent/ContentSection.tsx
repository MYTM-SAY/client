'use client'
import React from 'react'
import Lesson from './Lesson'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface Material {
  id: number
  materialType: string
  fileUrl: string
  createdAt: string
  updatedAt: string
  lessonId: number
}

interface LessonType {
  id: number
  title: string
  duration: number
  completed: boolean
  notes: string
  materials: Material[]
}

interface CourseContentSection {
  section: number
  title: string
  completed: number
  total: number
  duration: number
  lessons: LessonType[]
}

interface ContentSectionProps {
  courseContent: CourseContentSection[]
  selectedLesson: LessonType | null
  setSelectedLesson: (lesson: LessonType) => void
  toggleLessonCompletion: (lessonId: number) => Promise<boolean>
}

const ContentSection = ({ courseContent, selectedLesson, setSelectedLesson, toggleLessonCompletion }: ContentSectionProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="section-3">
      {courseContent.map((section: CourseContentSection) => {
        // Calculate the number of completed lessons dynamically
        const completedLessons = section.lessons.filter(
          (lesson: LessonType) => lesson.completed,
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
                {section.lessons.map((lesson: LessonType) => (
                  <Lesson
                    key={lesson.id}
                    lesson={lesson}
                    onSelect={() => setSelectedLesson(lesson)}
                    selected={selectedLesson?.id === lesson.id}
                    toggleLessonCompletion={toggleLessonCompletion}
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
