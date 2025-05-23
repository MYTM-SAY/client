import { axiosInstance } from './'
import { AxiosError } from 'axios'
import type { ServerError } from '@/types'

export async function getUserProfileInfo(id: string | number) {
  try {
    const res = await axiosInstance.get(`/profiles/${id}`)
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
export async function getUserContributions(id: string) {
  try {
    const res = await axiosInstance.get(`/profiles/contributions/${id}`)
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
export async function getUserCommunities() {
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
export async function createProfile(formData: FormData) {
  try {
    const res = await axiosInstance.post('/profiles', {
      bio: formData.get('bio'),
      twitter: formData.get('twitter'),
      facebook: formData.get('facebook'),
      instagram: formData.get('instagram'),
      linkedin: formData.get('linkedin'),
      youtube: formData.get('youtube'),
      profilePictureURL: formData.get('profilePictureURL'),
      tags: formData.get('tags'),
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
