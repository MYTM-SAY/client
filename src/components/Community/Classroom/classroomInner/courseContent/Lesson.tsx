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
  duration?: number
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
  onSelect: () => void
  selected: boolean
  toggleLessonCompletion: (lessonId: number) => Promise<boolean>
}

const Lesson = ({ lesson, onSelect, selected, toggleLessonCompletion }: LessonProps) => {
  const handleCheckboxChange = async () => {
    try {
      await toggleLessonCompletion(lesson.id)
    } catch (error) {
      // If the API call fails, revert the optimistic update or show an error
      console.error('Failed to toggle lesson completion:', error)
    }
  }

  // Calculate total duration from materials, fallback to lesson duration
  const getTotalDuration = () => {
    if (lesson.materials && lesson.materials.length > 0) {
      const materialDuration = lesson.materials.reduce((total, material) => 
        total + (material.duration || 0), 0
      )
      return materialDuration > 0 ? materialDuration : lesson.duration
    }
    return lesson.duration
  }

  const totalDuration = getTotalDuration()

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
        onCheckedChange={(checked) => {
          if (typeof checked === 'boolean') {
            handleCheckboxChange();
          }
        }}
        onClick={e => e.stopPropagation()}
      />
      <div className="flex flex-col ">
        <span>
          {lesson.id}. {lesson.title}
        </span>
        <div className="flex items-center gap-2 p-sm-muted">
          <MdOutlineScreenshotMonitor />

          {totalDuration > 0 && (
            <span className="p-sm-muted">{totalDuration} min</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Lesson
