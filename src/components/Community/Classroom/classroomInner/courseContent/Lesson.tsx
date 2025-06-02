import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { MdOutlineScreenshotMonitor } from 'react-icons/md'

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

interface LessonProps {
  lesson: LessonType
  setCourseContent: (content: any) => void
  courseContent: any
  onSelect: () => void
  selected: boolean
}

const Lesson = ({ lesson, setCourseContent, courseContent, onSelect, selected }: LessonProps) => {
  const handleCheckboxChange = () => {
    const updatedStatus = !lesson.completed

    // Create a new courseContent array with updated lessons
    const updatedCourseContent = courseContent.map((section: any) => {
      return {
        ...section,
        lessons: section.lessons.map((l: any) =>
          l.id === lesson.id ? { ...l, completed: updatedStatus } : l,
        ),
      }
    })

    // Update the state with the modified courseContent
    setCourseContent([...updatedCourseContent]) // Ensure a new array reference
  }

  return (
    <div
      className={`flex gap-2 cursor-pointer rounded px-2 py-1 ${selected ? 'bg-accent/20 border border-accent' : ''}`}
      onClick={onSelect}
    >
      <Checkbox
        checked={lesson.completed}
        className={` border-white mt-1 ${
          lesson.completed ? '!bg-green-500 border-0' : ''
        }`}
        onCheckedChange={e => {
          e?.stopPropagation?.();
          handleCheckboxChange();
        }}
        onClick={e => e.stopPropagation()}
      />
      <div className="flex flex-col ">
        <span>
          {lesson.id}. {lesson.title}
        </span>
        <div className="flex items-center gap-2 p-sm-muted">
          <MdOutlineScreenshotMonitor />

          {lesson.duration > 0 && (
            <span className="p-sm-muted">{lesson.duration} min</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Lesson
