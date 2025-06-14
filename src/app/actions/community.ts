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
  onlineMembers: number | string
  isPendingRequest: boolean
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
  id: string | number,
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

export async function leaveCommunity(id: string | number) {
  try {
    const res = await axiosInstance.delete(`/communities/${id}/leave`)
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

export async function getTheRoleOfAuth(id: string | number) {
  try {
    const res = await axiosInstance.get(
      `/communities/${id}/user-role-in-a-community`,
    )
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

export async function getMods(id: string) {
  try {
    const res = await axiosInstance.get(`/communities/${id}/mods`)
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

export async function deleteMember(
  communityId: string | number,
  userId: string | number,
) {
  try {
    const res = await axiosInstance.delete(
      `/communities/${communityId}/users/${userId}`,
    )
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

export async function getUsersOfCommunity(communityId: string | number) {
  try {
    const res = await axiosInstance.get(`/communities/${communityId}/users`)
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

export async function toggleFav(communityId: string | number) {
  try {
    const res = await axiosInstance.patch(`/favorites/${communityId}/toggle`)
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

export interface JoinRequest {
  id: number
  userId: number
  communityId: number
  createdAt: string
  updatedAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  User?: {
    id: number
    fullname: string
    username: string
    email: string
    profileImgURL?: string
  }
}

export interface FavoriteResponse {
  id: number
  userId: number
  communityId: string | number
  createdAt: string
  updatedAt: string
  name: string
  logoImgURL: string
  isPublic: boolean
  description?: string
  bio?: string
  coverImgURL?: string
  Owner?: {
    id: string | number
    fullname: string
    username: string
  }
}

export async function getCommunityJoinRequests(
  communityId: string | number,
): Promise<ServerResponse<JoinRequest[]>> {
  try {
    const res = await axiosInstance.get(
      `/communities/${communityId}/join-requests`,
    )
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

export async function updateJoinRequestStatus(
  requestId: number,
  status: 'APPROVED' | 'REJECTED',
): Promise<ServerResponse<JoinRequest>> {
  try {
    const res = await axiosInstance.patch(
      `/communities/join-requests/status/${requestId}`,
      { status },
    )
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

export async function getFav(): Promise<ServerResponse<FavoriteResponse[]>> {
  try {
    const res = await axiosInstance.get(`/favorites`)
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

export async function getAllCommunities() {
  try {
    const res = await axiosInstance.get(`/communities`)
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

export async function joinCommunity(
  communityId: string | number,
): Promise<ServerResponse<JoinRequest>> {
  try {
    const res = await axiosInstance.post(
      `/communities/${communityId}/join-requests`,
    )
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response?.data as never as ServerError
    console.log('response', response)
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}

export async function changeCommunityVisibility(
  communityId: string | number,
  isPublic: boolean,
) {
  try {
    const res = await axiosInstance.put(`/communities/${communityId}/`, {
      isPublic,
    })
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
