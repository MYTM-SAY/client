'use server'

import type { ServerResponse, ServerError, Community } from '@/types'
import { axiosInstance } from './'
import { AxiosError } from 'axios'

export async function createPost(formData: FormData) {
  const postData = Object.fromEntries(formData.entries()) as {
    fid: string // forum id
    title: string
    content: string
    media: unknown // TODO: define file type
  }

  try {
    const res = await axiosInstance.post(`/posts/forums/${postData.fid}`, {
      title: postData.title,
      content: postData.content,
      attachments: [], // TODO: add file upload
    })

    console.log('post created', res.data)
  } catch (error) {
    console.log('error creating post', error)
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
