import { Progress } from '@/components/ui/progress'
import { FaTrophy } from 'react-icons/fa'

import React from 'react'
const CourseProgress = ({ courseContent }: any) => {
  const totalCompleted = courseContent.reduce((acc: number, section: any) => {
    return (
      acc + section.lessons.filter((lesson: any) => lesson.completed).length
    )
  }, 0)

  // Count total lessons
  const totalLessons = courseContent.reduce((acc: number, section: any) => {
    return acc + section.lessons.length
  }, 0)

  // Calculate percentage
  const percentage = Math.round((totalCompleted / totalLessons) * 100)

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
