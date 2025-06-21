'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useQuiz from '@/hooks/useQuiz'
import { QuizSubmission } from '@/types'
import QuizTaking from '@/app/Quiz/components/QuizTaking'
import QuizResults from '@/app/Quiz/components/QuizResults'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Clock, Users, Trophy } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = parseInt(params.quizId as string)
  
  const { quiz, isLoading, error, getQuizById, submitQuiz } = useQuiz()
  const [currentView, setCurrentView] = useState<'overview' | 'taking' | 'results'>('overview')
  const [quizSubmission, setQuizSubmission] = useState<QuizSubmission | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null)

  useEffect(() => {
    if (quizId) {
      getQuizById(quizId)
    }
  }, [quizId])

  useEffect(() => {
    if (quiz && currentView === 'taking') {
      setTimeRemaining(quiz.duration * 60) // Convert minutes to seconds
      setQuizStartTime(new Date()) // Track when quiz started
    }
  }, [quiz, currentView])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (currentView === 'taking' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [currentView, timeRemaining])

  const handleTimeUp = () => {
    // Auto-submit quiz when time runs out
    if (quizSubmission) {
      handleQuizSubmit(quizSubmission)
    } else {
      setCurrentView('results')
    }
  }

  const handleStartQuiz = () => {
    if (quiz?.isAttempted) {
      alert('You have already attempted this quiz')
      return
    }
    setCurrentView('taking')
  }

  const handleQuizSubmit = async (submission: QuizSubmission) => {
    if (!quizStartTime) {
      console.error('Quiz start time not recorded')
      return
    }

    try {
      const endTime = new Date()
      
      // Use the submitQuiz function from the hook
      await submitQuiz(submission, quizStartTime, endTime)
      
      console.log('Quiz submitted successfully')
      setQuizSubmission(submission)
      setCurrentView('results')
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      alert('Failed to submit quiz. Please try again.')
    }
  }

  const handleBackToOverview = () => {
    // If coming from results view, refresh the page to reset the quiz state
    if (currentView === 'results') {
      window.location.reload()
    } else {
      // If coming from taking view, just reset to overview
      setCurrentView('overview')
      setTimeRemaining(0)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isQuizActive = () => {
    if (!quiz) return false
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    const endDate = new Date(quiz.endDate)
    return now >= startDate && now <= endDate && quiz.active
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Quiz Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">The requested quiz could not be found.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentView === 'taking') {
    return (
      <QuizTaking
        quiz={quiz}
        timeRemaining={timeRemaining}
        onSubmit={handleQuizSubmit}
        onBack={handleBackToOverview}
      />
    )
  }

  if (currentView === 'results') {
    return (
      <QuizResults
        quiz={quiz}
        submission={quizSubmission}
        onBackToOverview={handleBackToOverview}
      />
    )
  }

  // Quiz Overview
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{quiz.name}</CardTitle>
            <p className="text-muted-foreground">
              Classroom ID: {quiz.classroomId}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{quiz.duration} minutes</p>
                  <p className="text-sm text-muted-foreground">Duration</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{quiz.questionCount || quiz.QuizQuestions?.length || 0} questions</p>
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                <Trophy className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{quiz.finalScore || 'TBD'} points</p>
                  <p className="text-sm text-muted-foreground">Total Score</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Start:</span>{' '}
                    {formatDate(quiz.startDate)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">End:</span>{' '}
                    {formatDate(quiz.endDate)}
                  </div>
                </div>
              </div>

              {quiz.isAttempted && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have already attempted this quiz. You cannot take it again.
                  </AlertDescription>
                </Alert>
              )}

              {!isQuizActive() && !quiz.isAttempted && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This quiz is not currently active. It may have ended or not yet started.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleStartQuiz}
                  disabled={quiz.isAttempted || !isQuizActive()}
                  className="px-8"
                >
                  {quiz.isAttempted ? 'Already Attempted' : 'Start Quiz'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
