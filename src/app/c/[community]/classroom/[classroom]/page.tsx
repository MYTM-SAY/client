'use client'
import CourseContent from '@/components/Community/Classroom/classroomInner/courseContent/CourseContent'
import CourseProgress from '@/components/Community/Classroom/classroomInner/courseContent/CourseProgress'
import Under from '@/components/Community/Classroom/classroomInner/VideoPart/underVideo/Under'
import MediaViewer from '@/components/Community/Classroom/classroomInner/VideoPart/MediaViewer'
import React, { useState, useEffect, useCallback } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useParams } from 'next/navigation'
import { useClassroomDetails } from '@/hooks/useClassroom'
import useQuiz from '@/hooks/useQuiz'
import QuizPreview from '../_components/QuizPreview'
// Define the lesson type for selectedLesson
interface LessonType {
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
}

type TabType = 'content' | 'quizzes'

export default function Page() {
  const { classroom: classroomId } = useParams() as { classroom: string }
  const { community: communityId } = useParams() as {
    community: string | number
  }
  const {
    courseContent: initialCourseContent,
    isLoading,
    classroom,
    toggleLessonCompletion,
  } = useClassroomDetails(classroomId)
  const [showContent, setShowContent] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hideContent, setHideContent] = useState(false)
  const [courseContent, setCourseContent] = useState(initialCourseContent)
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const {
    quizzes,
    isLoading: quizzesLoading,
    getQuizzesByClassroom,
  } = useQuiz()
  // Function to check screen width
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 1024)
  }, [])

  useEffect(() => {
    handleResize() // Check on initial render
    window.addEventListener('resize', handleResize) // Add resize listener
    return () => window.removeEventListener('resize', handleResize) // Cleanup listener
  }, [handleResize])

  useEffect(() => {
    if (classroomId) {
      getQuizzesByClassroom(classroomId)
    }
  }, [classroomId])

  useEffect(() => {
    setCourseContent(initialCourseContent)
  }, [initialCourseContent])

  // Set default selectedLesson to the first lesson if none is selected
  useEffect(() => {
    if (!selectedLesson && courseContent && courseContent.length > 0) {
      // Find the first lesson in the first section that has lessons
      const firstSectionWithLessons = courseContent.find(
        (section) =>
          Array.isArray(section.lessons) && section.lessons.length > 0,
      )
      if (firstSectionWithLessons) {
        setSelectedLesson(firstSectionWithLessons.lessons[0])
      }
    }
  }, [selectedLesson, courseContent])

  if (isLoading)
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="flex flex-col items-center justify-center">
            {/* Modern gradient pulse animation */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-75"></div>
            </div>

            {/* Animated text with staggered letters */}
            <p className="mt-6 text-lg font-medium text-gray-700 flex justify-center space-x-1">
              {[
                'L',
                'o',
                'a',
                'd',
                'i',
                'n',
                'g',
                '',
                'C',
                'l',
                'a',
                's',
                's',
                'r',
                'o',
                'o',
                'm',
              ].map((char, i) => (
                <span
                  key={i}
                  className="animate-wave inline-block"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {char}
                </span>
              ))}
            </p>

            {/* Progress bar */}
            <div className="mt-4 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 animate-progress"></div>
            </div>
          </div>
        </div>
      </main>
    )

  return (
    <div className="flex gap-4 mlg:flex-col relative">
      <div className="flex flex-1 flex-col gap-4 ">
        <MediaViewer selectedLesson={selectedLesson} />
        <Under
          setShowContent={setShowContent}
          description={classroom?.description}
        />
      </div>

      {((showContent && isMobile) || (!isMobile && !hideContent)) && (
        <div className="relative w-[400px] mlg:w-full">
          <div className="flex border-b border-border">
            <button
              className={`flex-1 py-3 font-medium ${
                activeTab === 'content'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button
              className={`flex-1 py-3 font-medium ${
                activeTab === 'quizzes'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab('quizzes')}
            >
              Quizzes
            </button>
          </div>

          {activeTab === 'content' ? (
            <>
              <CourseProgress courseContent={courseContent} />
              <CourseContent
                setHideContent={setHideContent}
                courseContent={courseContent}
                selectedLesson={selectedLesson}
                setSelectedLesson={setSelectedLesson}
                toggleLessonCompletion={toggleLessonCompletion}
              />
            </>
          ) : (
            <QuizPreview
              quizzes={quizzes}
              isLoading={quizzesLoading}
              classroomId={classroomId}
              communityId={communityId}
            />
          )}
        </div>
      )}
    </div>
  )
}
