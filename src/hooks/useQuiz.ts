import { useState } from 'react'
import { instance } from '@/lib/utils/axios'
import { ApiResponseError, ApiResponse, Quiz, QuizSubmission } from '@/types'

interface QuizQuestionInput {
  questionId: number
  points: number
}

interface CreateQuiz {
  name: string
  duration: number
  startDate: string
  endDate: string
  classroomId: number
  active: boolean
  quizQuestions: QuizQuestionInput[]
}

interface EditQuiz {
  name?: string
  duration?: number
  startDate?: string
  endDate?: string
  classroomId?: number
  active?: boolean
  quizQuestions?: QuizQuestionInput[]
}

interface QuizSubmissionRequest {
  startDate: string
  endDate: string
  score: number
}

const useQuiz = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateScore = (submission: QuizSubmission, quizData: Quiz): number => {
    if (!quizData?.QuizQuestions) return 0
    
    let totalScore = 0
    
    submission.answers.forEach(answer => {
      const quizQuestion = quizData.QuizQuestions?.find(qq => qq.questionId === answer.questionId)
      if (quizQuestion) {
        const correctAnswers = quizQuestion.Question.answer
        const userAnswers = answer.selectedAnswers
        
        // Check if answers match (considering multi-select questions)
        const isCorrect = correctAnswers.length === userAnswers.length &&
          correctAnswers.every(ans => userAnswers.includes(ans))
        
        if (isCorrect) {
          totalScore += quizQuestion.points
        }
      }
    })
    
    return totalScore
  }

  async function createQuiz(quiz: CreateQuiz) {
    try {
      setIsLoading(true)
      const response: ApiResponse<Quiz> = await instance.post('/quizzes', quiz)
      setQuizzes([response.data.data, ...quizzes])
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
      return error.response?.data
    } finally {
      setIsLoading(false)
    }
  }

  async function editQuiz(id: number, quiz: EditQuiz) {
    try {
      setIsLoading(true)
      const response: ApiResponse<Quiz> = await instance.patch(
        `/quizzes/${id}`,
        quiz,
      )
      setQuizzes(quizzes.map((q) => (q.id === id ? response.data.data : q)))
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
      return error.response?.data
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteQuiz(id: number) {
    try {
      setIsLoading(true)
      const response: ApiResponse<Quiz> = await instance.delete(
        `/quizzes/${id}`,
      )
      setQuizzes(quizzes.filter((q) => q.id !== id))
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
      return error.response?.data
    } finally {
      setIsLoading(false)
    }
  }

  async function getQuizzesByClassroom(classroomId: string) {
    try {
      setIsLoading(true)
      const response: ApiResponse<Quiz[]> = await instance.get(
        `/quizzes/classroom/${classroomId}`,
      )
      setQuizzes(response.data.data)
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function getQuizzesByCommunity(communityId: string) {
    try {
      setIsLoading(true)
      const response: ApiResponse<Quiz[]> = await instance.get(
        `/quizzes/community/${communityId}`,
      )
      setQuizzes(response.data.data)
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function getQuizById(id: number) {
    try {
      setIsLoading(true)
      const response: ApiResponse<Quiz> = await instance.get(`/quizzes/${id}`)
      setQuiz(response.data.data)
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function submitQuiz(submission: QuizSubmission, startTime: Date, endTime: Date) {
    try {
      setIsLoading(true)
      
      if (!quiz) {
        throw new Error('Quiz data not available')
      }
      
      const score = calculateScore(submission, quiz)
      
      const submissionData: QuizSubmissionRequest = {
        startDate: startTime.toISOString(),
        endDate: endTime.toISOString(),
        score: score
      }
      
      const response: ApiResponse<{ success: boolean; message: string }> = await instance.post(
        `/quizzes/${submission.quizId}/submit-quiz`,
        submissionData
      )
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    quizzes,
    quiz,
    isLoading,
    error,
    createQuiz,
    editQuiz,
    deleteQuiz,
    getQuizzesByClassroom,
    getQuizzesByCommunity,
    getQuizById,
    submitQuiz,
  }
}

export default useQuiz
