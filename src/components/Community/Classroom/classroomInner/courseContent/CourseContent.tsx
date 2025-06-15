import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import ContentSection from './ContentSection'

interface Material {
  id: number
  materialType: string
  fileUrl: string
  createdAt: string
  updatedAt: string
  lessonId: number
  duration?: number
}

interface Lesson {
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
  lessons: Lesson[]
}

interface CourseContentProps {
  setHideContent: (hide: boolean) => void
  courseContent: CourseContentSection[]
  selectedLesson: Lesson | null
  setSelectedLesson: (lesson: Lesson) => void
  toggleLessonCompletion: (lessonId: number) => Promise<boolean>
}

const CourseContent = ({
  setHideContent,
  courseContent,
  selectedLesson,
  setSelectedLesson,
  toggleLessonCompletion,
}: CourseContentProps) => {
  return (
    <div className="w-[400px] mlg:w-full pb-16 pt-4 rounded-lg px-4 mt-6 bg-card">
      <div className="flex justify-between items-center pb-4  border-b border-border">
        <h5 className="h5"> Course Content</h5>
        <IoCloseSharp
          fontSize={24}
          className="cursor-pointer mlg:hidden "
          onClick={() => setHideContent(true)}
        />
      </div>
      <ContentSection
        courseContent={courseContent}
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
        toggleLessonCompletion={toggleLessonCompletion}
      />
    </div>
  )
}

export default CourseContent
