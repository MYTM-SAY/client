import { backendBaseUrl } from '@/lib/utils'
import axios, { AxiosHeaders } from 'axios'
import { cookies } from 'next/headers'

export async function getAuthCookies() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value || ''
  const refreshToken = cookieStore.get('refreshToken')?.value || ''

  return `accessToken=${accessToken}; refreshToken=${refreshToken}`
}

export const axiosInstance = axios.create({
  baseURL: backendBaseUrl,
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const cookieHeader = await getAuthCookies()

    if (config.headers?.set) {
      config.headers.set('Cookie', cookieHeader)
    } else if (config.headers) {
      config.headers['Cookie'] = cookieHeader
    } else {
      config.headers = new AxiosHeaders({
        Cookie: cookieHeader,
      })
    }

    return config
  },
  (error) => Promise.reject(error),
)
