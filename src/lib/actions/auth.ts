'use server'

import { AxiosError } from 'axios'
import axios from '@/lib/utils/axios'
import { cookies } from 'next/headers'

const backendBaseUrl = process.env.BACKEND_BASE_URL

export const getUser = async () => {
  try {
    const cookieStore = await cookies()
    const res = await axios.get(`${backendBaseUrl}/users/me`, {
      headers: {
        Cookie: `accessToken=${cookieStore.get('accessToken')?.value}; refreshToken=${
          cookieStore.get('refreshToken')?.value
        }`,
      },
    })
    return res.data.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.error(axiosError)
    return { success: false, data: axiosError.response?.data || 'An error occurred' }
  }
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const username = formData.get('username')?.toString()
  const fullname = formData.get('name')?.toString()

  if (!email || !password || !username || !fullname) {
    return { success: false, data: 'Email, password, username and full name are required' }
  }
  try {
    const res = await axios.post(`${backendBaseUrl}/auth/register`, {
      email,
      password,
      username,
      fullname,
    })

    const cookieStore = await cookies()
    cookieStore.set('accessToken', res.data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    })
    cookieStore.set('refreshToken', res.data.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return { success: true, data: res.data }
  } catch (error) {
    const axiosError = error as AxiosError
    console.error(axiosError)
    return { success: false, data: axiosError.response?.data || 'An error occurred' }
  }
}

export const signInAction = async ({ email, password }: { email: string; password: string }) => {
  try {
    const res = await axios.post(`${backendBaseUrl}/auth/login`, {
      email,
      password,
    })

    if (res.status !== 200) {
      return { success: false, data: res.data.error.message }
    }

    const cookieStore = await cookies()
    cookieStore.set('accessToken', res.data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    })
    cookieStore.set('refreshToken', res.data.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return { success: true, data: res.data }
  } catch (error) {
    const axiosError = error as AxiosError
    console.error(axiosError)
    return { success: false, data: axiosError.response?.data || 'An error occurred' }
  }
}

export const signOutAction = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  return { success: true, data: 'Signed out successfully' }
}
