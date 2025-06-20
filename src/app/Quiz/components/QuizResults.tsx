'use client'

import React from 'react'
import { Quiz, QuizSubmission } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw } from 'lucide-react'

interface QuizResultsProps {
  quiz: Quiz
  submission: QuizSubmission | null
  onBackToOverview: () => void
}

const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  submission,
  onBackToOverview,
}) => {
  const questions = quiz.QuizQuestions || []

  const calculateResults = () => {
    if (!submission) return { score: 0, totalPoints: 0, correctAnswers: 0 }

    let score = 0
    let correctAnswers = 0
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

    questions.forEach((quizQuestion) => {
      const question = quizQuestion.Question
      const userAnswer = submission.answers.find(
        (a) => a.questionId === question.id
      )

      if (!userAnswer) return

      // Check if answer is correct
      const isCorrect = checkAnswer(question.answer, userAnswer.selectedAnswers, question.type)
      
      if (isCorrect) {
        score += quizQuestion.points
        correctAnswers++
      }
    })

    return { score, totalPoints, correctAnswers }
  }

  const checkAnswer = (correctAnswers: string[], userAnswers: string[], type: string) => {
    if (type === 'SINGLE' || type === 'TRUE_FALSE') {
      return correctAnswers.length === 1 && userAnswers.length === 1 && 
             correctAnswers[0] === userAnswers[0]
    } else if (type === 'MULTI') {
      if (correctAnswers.length !== userAnswers.length) return false
      return correctAnswers.every(answer => userAnswers.includes(answer)) &&
             userAnswers.every(answer => correctAnswers.includes(answer))
    }
    return false
  }

  const getQuestionResult = (questionId: number) => {
    if (!submission) return { isCorrect: false, userAnswer: [] }

    const quizQuestion = questions.find(q => q.Question.id === questionId)
    const userAnswer = submission.answers.find(a => a.questionId === questionId)

    if (!quizQuestion || !userAnswer) return { isCorrect: false, userAnswer: [] }

    const isCorrect = checkAnswer(
      quizQuestion.Question.answer,
      userAnswer.selectedAnswers,
      quizQuestion.Question.type
    )

    return { isCorrect, userAnswer: userAnswer.selectedAnswers }
  }

  const results = calculateResults()
  const percentage = results.totalPoints > 0 ? Math.round((results.score / results.totalPoints) * 100) : 0

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quiz Results</h1>
          <Button variant="outline" onClick={onBackToOverview}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
        </div>

        {/* Results Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{quiz.name} - Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-secondary/20 rounded-lg">
                <div className={`text-3xl font-bold ${getGradeColor(percentage)}`}>
                  {percentage}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
                <Badge variant="secondary" className="mt-2">
                  Grade: {getGradeLetter(percentage)}
                </Badge>
              </div>

              <div className="text-center p-4 bg-secondary/20 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {results.score}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Points Earned
                </p>
                <p className="text-xs text-muted-foreground">
                  out of {results.totalPoints}
                </p>
              </div>

              <div className="text-center p-4 bg-secondary/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {results.correctAnswers}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Correct Answers
                </p>
                <p className="text-xs text-muted-foreground">
                  out of {questions.length}
                </p>
              </div>

              <div className="text-center p-4 bg-secondary/20 rounded-lg">
                <div className="text-3xl font-bold">
                  <Clock className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Completed
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Question Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((quizQuestion, index) => {
              const question = quizQuestion.Question
              const result = getQuestionResult(question.id)
              
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Question {index + 1}</span>
                      {result.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <Badge variant={result.isCorrect ? 'default' : 'destructive'}>
                        {result.isCorrect ? `+${quizQuestion.points}` : '0'} pts
                      </Badge>
                    </div>
                    <Badge variant="outline">
                      {question.type}
                    </Badge>
                  </div>

                  <h3 className="font-medium mb-3">{question.questionHeader}</h3>

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = question.answer.includes(option)
                      const isSelected = result.userAnswer.includes(option)
                      
                      let optionClass = 'p-2 rounded border '
                      
                      if (isCorrect && isSelected) {
                        optionClass += 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300'
                      } else if (isCorrect && !isSelected) {
                        optionClass += 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/10 dark:border-green-400 dark:text-green-400'
                      } else if (!isCorrect && isSelected) {
                        optionClass += 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300'
                      } else {
                        optionClass += 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                      }

                      return (
                        <div key={optionIndex} className={optionClass}>
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            <div className="flex items-center gap-2 text-sm">
                              {isCorrect && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Correct
                                </Badge>
                              )}
                              {isSelected && (
                                <Badge variant="outline" className="text-blue-600 border-blue-600">
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <Button onClick={onBackToOverview} size="lg">
            Complete Review
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuizResults 