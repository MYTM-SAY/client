'use server'

import axios from 'axios'
import { backendBaseUrl } from '../utils'

interface SuccessResponse {
  success: true
  data: {
    fileUrl: string
  }[]
}

interface ErrorResponse {
  success: false
  message: string
}

type UploadMediaReturn = SuccessResponse | ErrorResponse

export async function uploadMedia(files: File[]): Promise<UploadMediaReturn> {
  if (files.length === 0) {
    return { success: false, message: 'No files to upload' }
  }

  const filePromises = files.map((file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(`${backendBaseUrl}/upload/file`, formData)
  })
  const res = await Promise.all(filePromises)
  return { success: true, data: res.map((r) => r.data.fileUrl) }
}
