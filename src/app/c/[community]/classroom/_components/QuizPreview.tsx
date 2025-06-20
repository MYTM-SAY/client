import React from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Quiz } from '@/types'
import {
  FaRegClock,
  FaRegCalendarAlt,
  FaRegQuestionCircle,
  FaHourglassHalf,
  FaRegCheckCircle,
  FaRegTimesCircle,
} from 'react-icons/fa'
import { cn } from '@/lib/utils'

interface QuizPreviewProps {
  quizzes: Quiz[]
  isLoading: boolean
  classroomId: string
  communityId: string | number
}

const QuizPreview = ({
  quizzes,
  isLoading,
  classroomId,
  communityId,
}: QuizPreviewProps) => {
  if (isLoading) {
    return (
      <div className="p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-4 p-4 border rounded-lg bg-card">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!quizzes.length) {
    return (
      <div className="p-6 text-center flex flex-col items-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
          <FaRegQuestionCircle className="text-2xl text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No quizzes available</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          This classroom doesn't have any quizzes yet. Be the first to create
          one!
        </p>
        <Button asChild>
          <Link href={`/community/create-quiz?classroom=${classroomId}`}>
            Create Quiz
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4">
      {quizzes.map((quiz) => {
        return (
          <div
            key={quiz.id}
            className="mb-4 p-4 border rounded-lg bg-card transition-all hover:shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-base">{quiz.name}</h3>
            </div>

            <div className="flex flex-wrap gap-3 mb-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FaRegClock className="text-sm" />
                <span>{quiz.duration} minutes</span>
              </div>

              <div className="flex items-center gap-1">
                <FaRegCalendarAlt className="text-sm" />
                <span>
                  {new Date(quiz.startDate).toLocaleDateString()} -{' '}
                  {new Date(quiz.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/c/${communityId}/classroom/${classroomId}/quiz/${quiz.id}`}
                >
                  Take Quiz
                </Link>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default QuizPreview
