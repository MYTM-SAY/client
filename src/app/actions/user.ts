'use server'

import type { ServerError, ServerResponse } from '@/types'
import { axiosInstance } from './'
import { PostsResponse } from './post'
import { AxiosError } from 'axios'

export async function getUserByUsername(username: string) {
  try {
    const res = await axiosInstance.post('/users/getUserIdByUsername', {
      username: username,
    })
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as unknown as ServerError
    return {
      success: false,
      message: response?.message || 'Internal server error',
      statusCode: axiosError.response?.status,
    }
  }
}

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

export async function getAllPostsOfUserUsingId(id: string) {
  try {
    const res = await axiosInstance.get(`/posts/user/${id}`)
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

export async function getAuthenticatedUserDetails() {
  try {
    const res = await axiosInstance.get(`/users/me`)
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
export async function getUserByID(id: string | number) {
  try {
    const res = await axiosInstance.get(`/users/${id}`)
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
