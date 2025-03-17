import axios from '@/lib/utils/axios'
import { useEffect, useState } from 'react'

type User = {
  id: string
  email: string
  username: string
  fullname: string
}

const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
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

export default useUser
