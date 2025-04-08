'use client'
import CourseContent from '@/components/Community/Classroom/classroomInner/courseContent/CourseContent'
import CourseProgress from '@/components/Community/Classroom/classroomInner/courseContent/CourseProgress'
import Under from '@/components/Community/Classroom/classroomInner/VideoPart/underVideo/Under'
import VideoPart from '@/components/Community/Classroom/classroomInner/VideoPart/VideoPart'
import React, { useState, useEffect, useCallback } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
const courseContent2 = [
  {
    section: 1,
    title: 'Before we start',
    completed: 4,
    total: 4,
    duration: 30,
    lessons: [
      {
        id: 1,
        title: 'Inside the CPU Section Intro',
        duration: 4,
        completed: true,
      },
      {
        id: 3,
        title: 'Instruction Life Cycle',
        duration: 20,
        completed: true,
      },
      { id: 4, title: 'Demo', duration: 18, completed: true },
      {
        id: 5,
        title: 'Quiz 3: Inside the CPU Quiz',
        duration: 0,
        completed: false,
      }, // Quiz, no duration
    ],
  },
  {
    section: 2,
    title: 'Why an OS?',
    completed: 8,
    total: 8,
    duration: 98,
    lessons: [
      {
        id: 6,
        title: 'Inside the CPU Section Intro',
        duration: 4,
        completed: true,
      },
      { id: 7, title: 'CPU Components', duration: 56, completed: true },
      {
        id: 8,
        title: 'Instruction Life Cycle',
        duration: 20,
        completed: true,
      },
      { id: 9, title: 'Demo', duration: 18, completed: true },
      {
        id: 10,
        title: 'Quiz 3: Inside the CPU Quiz',
        duration: 0,
        completed: false,
      }, // Quiz, no duration
    ],
  },
  {
    section: 3,
    title: 'Inside the CPU',
    completed: 4,
    total: 5,
    duration: 98,
    lessons: [
      {
        id: 11,
        title: 'Inside the CPU Section Intro',
        duration: 4,
        completed: true,
      },
      { id: 12, title: 'CPU Components', duration: 56, completed: true },
      {
        id: 13,
        title: 'Instruction Life Cycle',
        duration: 20,
        completed: true,
      },
      { id: 14, title: 'Demo', duration: 18, completed: true },
      {
        id: 15,
        title: 'Quiz 3: Inside the CPU Quiz',
        duration: 0,
        completed: false,
      }, // Quiz, no duration
    ],
  },
]
const page = () => {
  const [courseContent, setCourseContent] = useState(courseContent2)
  const [showContent, setShowContent] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hideContent, setHideContent] = useState(false)
  // Function to check screen width
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 1024)
  }, [])

  useEffect(() => {
    handleResize() // Check on initial render
    window.addEventListener('resize', handleResize) // Add resize listener
    return () => window.removeEventListener('resize', handleResize) // Cleanup listener
  }, [handleResize])
  return (
    <div className="flex gap-4 mlg:flex-col relative">
      <div className="flex flex-1 flex-col gap-4 ">
        <VideoPart />
        <Under setShowContent={setShowContent} />
      </div>
      {hideContent && (
        <FaArrowLeftLong
          fontSize={24}
          className="cursor-pointer mlg:hidden absolute top-4 right-4 py-2 px-4 w-16 h-10 rounded-sm bg-card z-10"
          onClick={() => {
            setHideContent(false)
          }}
        />
      )}
      {((showContent && isMobile) || (!isMobile && !hideContent)) && (
        <div className="relative">
          <CourseProgress courseContent={courseContent} />
          <CourseContent
            setHideContent={setHideContent}
            courseContent={courseContent}
            setCourseContent={setCourseContent}
          />
        </div>
      )}
    </div>
  )
}

export default page
