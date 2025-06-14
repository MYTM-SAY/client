import { useState, useEffect } from 'react'
import { instance } from '@/lib/utils/axios'
import { ApiResponseError, ApiResponse, Community } from '@/types'

const useCommunity = (id: string | number) => {
  const [community, setCommunity] = useState<Community | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setIsLoading(true)
        const response: ApiResponse<Community> = await instance.get(
          `/communities/${id}`,
        )
        setCommunity(response.data.data)
      } catch (err) {
        const error = err as ApiResponseError
        setError(error.response?.data?.message)
        setCommunity(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunity()
  }, [id])

  return { community, isLoading, error }
}

export default useCommunity
