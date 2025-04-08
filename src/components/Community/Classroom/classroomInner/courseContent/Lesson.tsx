import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { MdOutlineScreenshotMonitor } from 'react-icons/md'
const courseContentStructure = [
  {
    section: 1,
    title: 'Before we start',
    completed: 4,
    total: 4,
    duration: 30,
    lessons: [
      {
        id: 22,
        title: 'Inside the CPU Section Intro',
        duration: 4,
        completed: true,
      },
      { id: 23, title: 'CPU Components', duration: 56, completed: true },
      {
        id: 24,
        title: 'Instruction Life Cycle',
        duration: 20,
        completed: true,
      },
      { id: 25, title: 'Demo', duration: 18, completed: true },
      {
        id: 26,
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
        id: 22,
        title: 'Inside the CPU Section Intro',
        duration: 4,
        completed: true,
      },
      { id: 23, title: 'CPU Components', duration: 56, completed: true },
      {
        id: 24,
        title: 'Instruction Life Cycle',
        duration: 20,
        completed: true,
      },
      { id: 25, title: 'Demo', duration: 18, completed: true },
      {
        id: 26,
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
        id: 22,
        title: 'Inside the CPU Section Intro',
        duration: 4,
        completed: true,
      },
      { id: 23, title: 'CPU Components', duration: 56, completed: true },
      {
        id: 24,
        title: 'Instruction Life Cycle',
        duration: 20,
        completed: true,
      },
      { id: 25, title: 'Demo', duration: 18, completed: true },
      {
        id: 26,
        title: 'Quiz 3: Inside the CPU Quiz',
        duration: 0,
        completed: false,
      }, // Quiz, no duration
    ],
  },
]
const Lesson = ({ lesson, setCourseContent, courseContent }: any) => {
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
    <div className="flex gap-2">
      <Checkbox
        checked={lesson.completed}
        className={` border-white mt-1 ${
          lesson.completed ? '!bg-green-500 border-0' : ''
        }`}
        onCheckedChange={handleCheckboxChange}
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
