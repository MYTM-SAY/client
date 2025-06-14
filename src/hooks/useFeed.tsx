import { useState, useEffect } from 'react'
import { instance } from '@/lib/utils/axios'
import { ApiResponseError } from '@/types'

interface FeedAuthor {
  id: number
  username: string
  fullname: string
  UserProfile: {
    profilePictureURL: string
  }
}

export interface FeedPost {
  id: number
  title: string
  content: string
  voteCounter: number
  attachments: string[]
  forumId: number
  createdAt: string
  updatedAt: string
  commentsCount: number
  Author: FeedAuthor
  voteType: 'UPVOTE' | 'DOWNVOTE' | null
  Forum: {
    Community: {
      id: number
      name: string
      description: string
      bio: string
      createdAt: string
      updatedAt: string
      coverImgURL: string
      logoImgURL: string
      ownerId: number
      isPublic: boolean
    }
  }
  Comments: {
    id: number
    content: string
    parentId: number | null
    postId: number
    authorId: number
    createdAt: string
    updatedAt: string
    Author: {
      id: number
      username: string
      fullname: string
      UserProfile: {
        profilePictureURL: string
      }
    }
  }[]
}

interface FeedResponse {
  success: boolean
  message: string
  data: FeedPost[]
}

const useFeed = () => {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await instance.get<FeedResponse>('/posts/me/feed')

        if (response.data.success) {
          setPosts(response.data.data)
        } else {
          setError(response.data.message || 'Failed to fetch feed')
        }
      } catch (err) {
        const error = err as ApiResponseError
        setError(
          error.response?.data?.message ||
            'An error occurred while fetching the feed',
        )
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeed()
  }, [])

  const refetchFeed = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await instance.get<FeedResponse>('/posts/me/feed')

      if (response.data.success) {
        setPosts(response.data.data)
      } else {
        setError(response.data.message || 'Failed to fetch feed')
      }
    } catch (err) {
      const error = err as ApiResponseError
      setError(
        error.response?.data?.message ||
          'An error occurred while fetching the feed',
      )
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  return { posts, isLoading, error, refetchFeed }
}

export default useFeed
