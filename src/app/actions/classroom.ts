import type { ServerResponse, ServerError, Classroom } from '@/types'
import { axiosInstance } from './'
import { AxiosError } from 'axios'


export async function getCommunityClassrooms(
  id: string,
): Promise<ServerResponse<Classroom[]>> {
  try {
    const res = await axiosInstance.get(`classrooms/communities/${id}`)
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
