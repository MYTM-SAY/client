import { useState, useEffect } from 'react'
import { instance } from '@/lib/utils/axios'
import { ApiResponseError, ApiResponse, Classroom } from '@/types'

interface CreateClassroom {
  name: string
  description: string
  coverImg: string
  communityId: number
}

type UpdateClassroom = Omit<CreateClassroom, 'communityId'>

const useClassrooms = (communityId: string) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setIsLoading(true)
        const response: ApiResponse<Classroom[]> = await instance.get(
          `/classrooms/communities/${communityId}`,
        )
        setClassrooms(response.data.data)
      } catch (err) {
        const error = err as ApiResponseError
        setError(error.response?.data?.message)
        setClassrooms([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchClassrooms()
  }, [communityId])

  async function createClassroom(classroom: CreateClassroom) {
    try {
      const response: ApiResponse<Classroom> = await instance.post(
        '/classrooms',
        classroom,
      )
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
    }
  }

  async function updateClassroom(id: string, classroom: UpdateClassroom) {
    try {
      const response: ApiResponse<Classroom> = await instance.put(
        `/classrooms/${id}`,
        classroom,
      )
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
    }
  }

  async function deleteClassroom(id: string) {
    try {
      const response: ApiResponse<Classroom> = await instance.delete(
        `/classrooms/${id}`,
      )
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
    }
  }

  return {
    classrooms,
    isLoading,
    error,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  }
}

export default useClassrooms
