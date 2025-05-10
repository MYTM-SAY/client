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
  authorId: number
  createdAt: string
  updatedAt: string
  Author: Author
  commentsCount: number
  Comments?: Comment[]
  Forum: {
    Community: Community
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
