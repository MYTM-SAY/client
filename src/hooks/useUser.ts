import { instance as axios } from '@/lib/utils/axios'
import { UserFromToken } from '@/types'
import { useEffect, useState } from 'react'


export const useUser = () => {
  const [user, setUser] = useState<UserFromToken | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)

        const res = await axios.get('/users/me')

        setUser(res.data.data)
      } catch (error) {
        console.error(error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  return { user, isLoading }
}
