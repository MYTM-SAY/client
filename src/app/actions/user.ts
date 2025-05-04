'use server'

import type { ServerError } from '@/types'
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
