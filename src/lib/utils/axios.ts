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
  tokenSubscribers.length = 0 // Clear array after processing
}

const subscribeTokenRefresh = (haltedReqCb: HaltedReqCb) => {
  tokenSubscribers.push(haltedReqCb)
}

instance.interceptors.response.use(
  (value) => value,
  async (error) => {
    const originalReq = error.config
    const errorResponse = error.response

    if (errorResponse?.status === 401) {
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
          window.location.href = '/sign-in'
          return Promise.reject(err)
        }
      } else if (errorResponse.data.message === 'Invalid refresh token' && isRefreshing) {
        window.location.href = '/sign-in'
        return Promise.reject(error)
      }
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(instance(originalReq))
          })
        })
      }
    }

    return Promise.reject(error)
  },
)

export default instance
