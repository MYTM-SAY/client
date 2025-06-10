import { useState, useEffect } from 'react'
import { instance } from '@/lib/utils/axios'
import { ApiResponseError, ApiResponse, Post } from '@/types'

interface CreatePost {
  title: string
  content: string
  attachments: string[]
}

const usePosts = (communityId: string) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const response: ApiResponse<Post[]> = await instance.get(
          `/posts/forums/${communityId}`,
        )
        setPosts(response.data.data)
      } catch (err) {
        const error = err as ApiResponseError
        setError(error.response?.data?.message)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [communityId])

  async function createPost(post: CreatePost) {
    try {
      const response: ApiResponse<Post> = await instance.post(
        `/posts/forums/${communityId}`,
        post,
      )
      setPosts([response.data.data, ...posts])
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      return error.response?.data
    }
  }

  async function deletePost(postId: number) {
    try {
      const response: ApiResponse<Post> = await instance.delete(
        `/posts/${postId}`,
      )
      setPosts(posts.filter((post) => post.id !== postId))
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      return error.response?.data
    }
  }

  return { posts, isLoading, error, createPost, deletePost }
}

export default usePosts
