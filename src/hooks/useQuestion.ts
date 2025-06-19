import { useState } from 'react'
import { instance } from '@/lib/utils/axios'
import { ApiResponse, ApiResponseError, Question } from '@/types'

interface QuestionBody {
  questionHeader: string
  options: string[]
  answer: string[]
  classroomId: number
  type: 'SINGLE' | 'MULTI' | 'TRUE_FALSE'
}

const useQuestion = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createQuestion = async (data: QuestionBody) => {
    try {
      setIsLoading(true)
      const response: ApiResponse<Question> = await instance.post(
        '/questions',
        data,
      )
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message || 'Failed to create question')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const editQuestion = async (id: string | number, data: QuestionBody) => {
    try {
      setIsLoading(true)
      const response: ApiResponse<Question> = await instance.put(
        `/questions/${id}`,
        data,
      )
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message || 'Failed to edit question')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteQuestion = async (id: string | number) => {
    try {
      setIsLoading(true)
      await instance.delete(`/questions/${id}`)
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message || 'Failed to delete question')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const fetchQuestionsByClassroom = async (classroomId: number) => {
    try {
      setIsLoading(true)
      const response: ApiResponse<Question[]> = await instance.get(
        `/questions/classrooms/${classroomId}`,
      )
      setQuestions(response.data.data)
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message || 'Failed to fetch questions')
      setQuestions([])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createQuestion,
    editQuestion,
    deleteQuestion,
    fetchQuestionsByClassroom,
    questions,
    isLoading,
    error,
  }
}

export default useQuestion
