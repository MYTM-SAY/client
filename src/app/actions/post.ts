'use server'

import type { ServerResponse, ServerError, Community } from '@/types'
import { axiosInstance } from './'
import { AxiosError } from 'axios'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const fid = formData.get('fid') as string

  try {
    const mediaUrls = formData.getAll('mediaUrls[]')

    const res = await axiosInstance.post(`/posts/forums/${fid}`, {
      title,
      content,
      attachments: mediaUrls,
    })

    revalidatePath(`/c/${fid}`)
    return res.data
  } catch (error) {
    console.error('error creating post', error)
    throw error
  }
}

export async function updatePost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const postId = formData.get('postId') as string
  const forumId = formData.get('forumId') as string

  try {
    const mediaUrls = formData.getAll('mediaUrls[]')

    const res = await axiosInstance.put(`/posts/${postId}`, {
      title,
      content,
      attachments: mediaUrls,
    })

    revalidatePath(`/c/${forumId}`)
    return res.data
  } catch (error) {
    console.error('error updating post', error)
    throw error
  }
}

interface Author {
  id: number
  username: string
  fullname: string
  UserProfile: {
    profilePictureURL: string
  }
}

export interface Comment {
  id: number
  parentId: number
  postId: number
  authorId: number
  content: string
  createdAt: string
  updatedAt: string
  Author: Author
}

export interface PostsResponse {
  id: number
  title: string
  content: string
  voteCounter: number
  attachments: string[]
  forumId: number
  createdAt: string
  updatedAt: string
  commentCount: number
  voteType: 'UPVOTE' | 'DOWNVOTE' | null
  Author: {
    id: number
    username: string
    fullname: string
    profilePictureURL: string
  }
}

export async function getPosts(
  forumId: string | number,
): Promise<ServerResponse<PostsResponse[]>> {
  try {
    const res = await axiosInstance.get(`/posts/forums/${forumId}`)
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}

export async function getPost(
  postId: string | number,
): Promise<ServerResponse<PostsResponse>> {
  try {
    const res = await axiosInstance.get(`/posts/${postId}`)
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}

export async function getPostComments(
  postId: string | number,
): Promise<ServerResponse<PostsResponse>> {
  try {
    const res = await axiosInstance.get(`/posts/${postId}`)
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}

export async function deletePost(
  postId: string | number,
): Promise<ServerResponse<null>> {
  try {
    await axiosInstance.delete(`/posts/${postId}`)
    revalidatePath('/p/[id]')
    return {
      success: true,
      data: null,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}

export async function upVote(postId: string | number) {
  try {
    await axiosInstance.put(`/posts/upvote/${postId}`)
    revalidatePath('/p/[id]')
    return {
      success: true,
      data: null,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}

export async function downVote(postId: string | number) {
  try {
    await axiosInstance.put(`/posts/downvote/${postId}`)
    revalidatePath('/p/[id]')
    return {
      success: true,
      data: null,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}
