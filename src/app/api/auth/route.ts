/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import axios, { AxiosError } from 'axios'
import { backendBaseUrl } from '@/lib/utils'


export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  try {
    const res = await axios.get(`${backendBaseUrl}/users/me`, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    })

    return NextResponse.json({ success: true, user: res.data.data })
  } catch (error) {
    const axiosError = error as AxiosError
    const resData = axiosError.response?.data as any

    if (axiosError.response?.status === 401 && resData?.message === 'Unauthorized') {
      try {
        const { data } = await axios.post(`${backendBaseUrl}/auth/refresh-token`, null, {
          headers: {
            Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
          },
        })

        console.log("from /refresh-token:", data)

        // Update access token in cookies
        cookieStore.set('accessToken', data.accessToken, {
          httpOnly: true,
          secure: true,
          path: '/',
        })

        // TODO: this needs a backend fix, userdata must be sent with the refresh token
        return NextResponse.json({ success: true, user: data.user })
      } catch {
        // Remove invalid refresh token
        cookieStore.delete('accessToken')
        cookieStore.delete('refreshToken')

        return NextResponse.json({ success: false, message: 'Invalid refresh token' }, { status: 401 })
      }
    }

    return NextResponse.json(
      { success: false, message: resData || 'An error occurred' },
      { status: axiosError.response?.status || 500 },
    )
  }
}
