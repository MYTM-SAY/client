'use server'

import type { ServerResponse, Role, ServerError, Post } from '@/types'
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

    console.log("post created", res.data)
  } catch (error) {
    console.log("error creating post", error)
  }
}

interface GetCommunityResponse {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  coverImgURL: string
  logoImgURL: string
  ownerId: number
  isPublic: boolean
  Classrooms: unknown[] // TODO: define missing types
  Forums: {
    Posts: Post[]
  }[]
}

export async function getCommunity(
  id: string,
): Promise<ServerResponse<GetCommunityResponse>> {
  try {
    const res = await axiosInstance.get(`/communities/${id}`)
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

interface GetJoinedCommunitiesResponse {
  Role: Role
  Community: {
    id: string | number
    name: string
    logoImgURL: string
  }
}

export async function getJoinedCommunities(
  id: string,
): Promise<ServerResponse<GetJoinedCommunitiesResponse[]>> {
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
