'use server'

import type { ServerResponse, ServerError } from '@/types'
import { axiosInstance } from './'
import { AxiosError } from 'axios'
import { z } from 'zod'

const CommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  postId: z.number(),
})

export type CommentFormData = z.infer<typeof CommentSchema>

interface Author {
  id: number
  username: string
  fullname: string
  UserProfile: {
    profilePictureURL: string
  }
}

export interface Comment {
  id: number
  content: string
  postId: number
  authorId: number
  createdAt: string
  updatedAt: string
  Author: Author
}

export async function createComment(
  data: CommentFormData,
): Promise<ServerResponse<Comment>> {
  try {
    const validatedFields = CommentSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid comment data',
        statusCode: 400,
      }
    }

    const { content, postId } = validatedFields.data

    const res = await axiosInstance.post(`/comments`, {
      content,
      postId,
    })

    return res.data
  } catch (error) {
    console.error('Error creating comment:', error)
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message:
        response?.message || 'Something went wrong while creating the comment.',
      statusCode: axiosError.status || 500,
    }
  }
}
