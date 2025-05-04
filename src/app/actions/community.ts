'use server'

import type { ServerResponse, Role, ServerError, Tag } from '@/types'
import { axiosInstance } from './'
import { AxiosError } from 'axios'

export interface GetCommunityResponse {
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
  Tags: Tag[]
  forumId: number
  membersCount: number
  role: Role
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
    MembersCount: number | string
    id: string | number
    name: string
    logoImgURL: string
    isPublic: boolean
    description?: string
    Owner: {
      id: string | number
      fullname: string
      username: string
    }
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
