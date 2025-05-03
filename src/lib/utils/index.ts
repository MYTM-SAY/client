export * from './cn'

export const backendBaseUrl = process.env.BACKEND_BASE_URL

export function formatDateTime(inputDate: string): string {
  const date = new Date(inputDate)

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  let hours = date.getUTCHours()
  const isPM = hours >= 12
  hours = hours % 12 || 12
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}${isPM ? 'PM' : 'AM'}`
}
