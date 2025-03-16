interface AuthState {
  accessToken?: string
  refreshToken?: string
}

export const handleAuthSuccess = (authData: AuthState) => {
  if (authData.accessToken)
    localStorage.setItem('accessToken', authData.accessToken)
  if (authData.refreshToken)
    localStorage.setItem('refreshToken', authData.refreshToken)
}

export const checkAuth = () => {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  if (accessToken && refreshToken) return true

  return false
}

export const getAuthHeaders = () => {
  const headers: Record<string, string> = {}

  // Add JWT auth if available
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  return headers
}

export const handleAuth = (accessToken: string, refreshToken: string) => {
  handleAuthSuccess({ accessToken, refreshToken })
}

export const clearAuth = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}
