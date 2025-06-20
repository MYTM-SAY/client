import React from 'react'
import { Quiz } from '@/types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface QuizDetailsProps {
  quiz: Quiz
  onClose: () => void
}

const QuizDetails: React.FC<QuizDetailsProps> = ({ quiz, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quiz Details
        </h2>
        <Button onClick={onClose} variant="outline">
          Back to List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{quiz.name}</CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Classroom ID: {quiz.classroomId}
              </p>
            </div>
            <Badge variant={quiz.active ? 'default' : 'secondary'}>
              {quiz.active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Schedule
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Start:</span>{' '}
                  {formatDate(quiz.startDate)} at {formatTime(quiz.startDate)}
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">End:</span>{' '}
                  {formatDate(quiz.endDate)} at {formatTime(quiz.endDate)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Duration
              </h3>
              <p className="text-sm">{quiz.duration} minutes</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Created:</span>{' '}
                {formatDate(quiz.createdAt)}
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Updated:</span>{' '}
                {formatDate(quiz.updatedAt)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuizDetails
