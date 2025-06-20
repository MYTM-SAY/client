'use client'

import React, { useState, useEffect } from 'react'
import { Quiz, QuizSubmission, QuizAnswer } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Clock, ArrowLeft, ArrowRight, Send } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface QuizTakingProps {
  quiz: Quiz
  timeRemaining: number
  onSubmit: (submission: QuizSubmission) => void
  onBack: () => void
}

const QuizTaking: React.FC<QuizTakingProps> = ({
  quiz,
  timeRemaining,
  onSubmit,
  onBack,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  const questions = quiz.QuizQuestions || []
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  useEffect(() => {
    // Initialize answers array
    const initialAnswers: QuizAnswer[] = questions.map((q) => ({
      questionId: q.Question.id,
      selectedAnswers: [],
    }))
    setAnswers(initialAnswers)
  }, [questions])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId: number, selectedAnswers: string[]) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, selectedAnswers }
          : answer
      )
    )
  }

  const getCurrentAnswer = (questionId: number) => {
    return answers.find((a) => a.questionId === questionId)?.selectedAnswers || []
  }

  const handleSingleChoice = (questionId: number, option: string) => {
    handleAnswerChange(questionId, [option])
  }

  const handleMultiChoice = (questionId: number, option: string, checked: boolean) => {
    const currentAnswers = getCurrentAnswer(questionId)
    if (checked) {
      handleAnswerChange(questionId, [...currentAnswers, option])
    } else {
      handleAnswerChange(questionId, currentAnswers.filter((a) => a !== option))
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const getAnsweredCount = () => {
    return answers.filter((answer) => answer.selectedAnswers.length > 0).length
  }

  const handleSubmit = () => {
    const submission: QuizSubmission = {
      quizId: quiz.id,
      answers: answers,
    }
    onSubmit(submission)
  }

  const renderQuestion = () => {
    if (!currentQuestion) return null

    const question = currentQuestion.Question
    const currentAnswer = getCurrentAnswer(question.id)

    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {currentQuestion.points} points
              </p>
            </div>
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1 rounded-lg">
              <Clock className="h-4 w-4" />
              {formatTime(timeRemaining)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-4">{question.questionHeader}</h3>

            {question.type === 'SINGLE' && (
              <RadioGroup
                value={currentAnswer[0] || ''}
                onValueChange={(value) => handleSingleChoice(question.id, value)}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                    <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === 'MULTI' && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${question.id}-${index}`}
                      checked={currentAnswer.includes(option)}
                      onCheckedChange={(checked) =>
                        handleMultiChoice(question.id, option, checked as boolean)
                      }
                    />
                    <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'TRUE_FALSE' && (
              <RadioGroup
                value={currentAnswer[0] || ''}
                onValueChange={(value) => handleSingleChoice(question.id, value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`${question.id}-true`} />
                  <Label htmlFor={`${question.id}-true`} className="cursor-pointer">
                    True
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`${question.id}-false`} />
                  <Label htmlFor={`${question.id}-false`} className="cursor-pointer">
                    False
                  </Label>
                </div>
              </RadioGroup>
            )}
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button onClick={() => setShowConfirmSubmit(true)}>
                <Send className="h-4 w-4 mr-2" />
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
          <h1 className="text-2xl font-bold">{quiz.name}</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Question Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{getAnsweredCount()}/{totalQuestions}</span>
                    </div>
                    <Progress value={(getAnsweredCount() / totalQuestions) * 100} />
                  </div>

                  <div className="grid grid-cols-5 gap-1">
                    {questions.map((_, index) => {
                      const isAnswered = answers[index]?.selectedAnswers.length > 0
                      const isCurrent = index === currentQuestionIndex
                      return (
                        <Button
                          key={index}
                          variant={isCurrent ? 'default' : isAnswered ? 'secondary' : 'outline'}
                          size="sm"
                          className="aspect-square text-xs"
                          onClick={() => goToQuestion(index)}
                        >
                          {index + 1}
                        </Button>
                      )
                    })}
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-secondary rounded"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-border rounded"></div>
                      <span>Unanswered</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            {renderQuestion()}
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardHeader>
                <CardTitle>Submit Quiz?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    You have answered {getAnsweredCount()} out of {totalQuestions} questions.
                    Once submitted, you cannot change your answers.
                  </AlertDescription>
                </Alert>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmSubmit(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    Submit Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizTaking 