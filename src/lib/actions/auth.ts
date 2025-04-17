'use server'

import axios from 'axios'
import { UserFromToken } from '@/types'
import { AxiosError } from 'axios'
import { cookies } from 'next/headers'
import { backendBaseUrl } from '../utils'

type GetUserReturn =
  | { success: true; user: UserFromToken }
  | { success: false; message: string }

export async function getUser(): Promise<GetUserReturn> {
  const cookieHeader = (await cookies())
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ')

  const base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

  const res = await fetch(`${base}/auth`, {
    credentials: 'include',
    headers: {
      Cookie: cookieHeader,
    },
  })
  const data = await res.json()
  return data
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const username = formData.get('username')?.toString()
  const fullname = formData.get('fullname')?.toString()
  const dob = formData.get('dob')?.toString()
  console.log(email, password, username, fullname, dob)
  if (!email || !password || !username || !fullname || !dob) {
    console.log(88)
    return { success: false, data: 'All fields are required' }
  }
  try {
    const res = await axios.post(`${backendBaseUrl}/auth/register`, {
      email,
      password,
      username,
      fullname,
      dob,
    })
    console.log(res)
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
    return {
      success: false,
      data: axiosError.response?.data || 'An error occurred',
    }
  }
}

export const signInAction = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
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
    return {
      success: false,
      data: axiosError.response?.data || 'An error occurred',
    }
  }
}

export const signOutAction = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  return { success: true, data: 'Signed out successfully' }
}
