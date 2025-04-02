import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

let isRefreshing = false

type HaltedReqCb = (newAccessToken: string) => void

const tokenSubscribers: HaltedReqCb[] = []

const onRefreshed = (newAccessToken: string) => {
  tokenSubscribers.forEach((cb) => cb(newAccessToken))
  tokenSubscribers.length = 0
}

const subscribeTokenRefresh = (haltedReqCb: HaltedReqCb) => {
  tokenSubscribers.push(haltedReqCb)
}

const customRedirect = (url: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = url
  }
}

instance.interceptors.response.use(
  (value) => value,
  async (error) => {
    const originalReq = error.config
    const errorResponse = error.response

    if (errorResponse?.status !== 401) {
      return Promise.reject(error)
    }

    if (errorResponse.data.message === 'Unauthorized' && !isRefreshing) {
      try {
        isRefreshing = true
        const {
          data: { accessToken },
        } = await instance.post('/auth/refresh-token')
        isRefreshing = false

        onRefreshed(accessToken)

        return instance(originalReq)
      } catch (err) {
        customRedirect('/sign-in')
        return Promise.reject(err)
      }
    }

    if (errorResponse.data.message === 'Invalid refresh token' && isRefreshing) {
      customRedirect('/sign-in')
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(instance(originalReq))
        })
      })
    }

    return Promise.reject(error)
  },
)

export { instance }
