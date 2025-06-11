import React from 'react'
import { Progress } from '@/components/ui/progress'
import { FaTrophy } from 'react-icons/fa'

interface CourseContentSection {
  section: number
  title: string
  completed: number
  total: number
  duration: number
  lessons: {
    id: number
    title: string
    duration: number
    completed: boolean
    notes: string
    materials: {
      id: number
      materialType: string
      fileUrl: string
      createdAt: string
      updatedAt: string
      lessonId: number
    }[]
  }[]
}

interface CourseProgressProps {
  courseContent: CourseContentSection[]
}

const CourseProgress = ({ courseContent }: CourseProgressProps) => {
  const totalCompleted = courseContent.reduce((acc, section) => {
    return acc + section.lessons.filter((lesson) => lesson.completed).length
  }, 0)

  // Count total lessons
  const totalLessons = courseContent.reduce((acc, section) => {
    return acc + section.lessons.length
  }, 0)

  // Calculate percentage
  const percentage = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0

  return (
    <div className="flex gap-2 justify-center items-center">
      <FaTrophy fontSize={22} className="text-yellow-500" />
      <div className="h-5 w-full relative">
        <span className="absolute top-[50%] translate-y-[-50%] left-2 z-10 p-sm">
          {percentage}%
        </span>
        <Progress value={percentage} className="bg-gray-300 h-5" />
      </div>
    </div>
  )
}

export default CourseProgress
