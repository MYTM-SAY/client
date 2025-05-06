'use server'

import type { ServerError, ServerResponse } from '@/types'
import { axiosInstance } from './'
import { AxiosError } from 'axios'

export async function getJoinedCommunities(id: string) {
  try {
    const res = await axiosInstance.get(`/users/${id}/communities`)
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

interface PostsResponse {
  id: number
  title: string
  content: string
  voteCounter: number
  attachments: string[]
  forumId: number
  authorId: number
  createdAt: string
  updatedAt: string
  Authorfiltered: {
    id: number
    username: string
    fullname: string
    profilePictureURL: string
  }
  commentsCount: number
}

export async function getAllPostsOfUserUsingId(id: string): Promise<ServerResponse<PostsResponse[]>> {
  try {
    const res = await axiosInstance.get(`/users/${id}/contributions`)
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
