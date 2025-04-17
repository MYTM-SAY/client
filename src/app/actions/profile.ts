import { axiosInstance } from './'
import { AxiosError } from 'axios'
import type { ServerError } from '@/types'

export async function getUserProfileInfo(id: string) {
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
