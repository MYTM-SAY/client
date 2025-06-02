import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import ContentSection from './ContentSection'

const CourseContent = ({
  setHideContent,
  courseContent,
  setCourseContent,
  selectedLesson,
  setSelectedLesson,
}: any) => {
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
        setCourseContent={setCourseContent}
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
      />
    </div>
  )
}

export default CourseContent
