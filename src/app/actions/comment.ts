'use server'

import type { ServerError } from '@/types'
import { axiosInstance } from './'
import { AxiosError } from 'axios'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

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

export async function createComment(data: CommentFormData) {
  try {
    const validatedFields = CommentSchema.safeParse(data)
    console.log(validatedFields)
    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid comment data',
        statusCode: 400,
      }
    }

    const { content, postId } = validatedFields.data
    console.log(content, postId)
    const res = await axiosInstance.post(`/comments/${postId}`, {
      content,
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

export interface CommentData {
  content: string
  postId: number | string
  parentId: number | string
}

export async function replyComment(formData: CommentData) {
  try {
    const res = await axiosInstance.post(`/comments/${formData.postId}`, {
      content: formData.content,
      parentId: formData.parentId,
    })
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}

export async function updateComment(commentId: number, content: string) {
  try {
    const res = await axiosInstance.put(`/comments/${commentId}`, {
      content,
    })

    revalidatePath(`/p/${commentId}`)
    return res.data
  } catch (error) {
    console.error('Error updating comment:', error)
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response?.message || 'Failed to update comment',
      statusCode: axiosError.status || 500,
    }
  }
}

export async function deleteComment(commentId: number) {
  try {
    await axiosInstance.delete(`/comments/${commentId}`)
    // Remove revalidatePath since we're client-side
    return {
      success: true,
      data: null,
    }
  } catch (error) {
    console.error('Error deleting comment:', error)
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response?.message || 'Failed to delete comment',
      statusCode: axiosError.status || 500,
    }
  }
}

export async function upVote(commentId: string | number) {
  try {
    await axiosInstance.put(`/comments/upvote/${commentId}`)
    revalidatePath('/p/[id]')
    return {
      success: true,
      data: null,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}

export async function downVote(commentId: string | number) {
  try {
    await axiosInstance.put(`/comments/downvote/${commentId}`)
    revalidatePath('/p/[id]')
    return {
      success: true,
      data: null,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}

export async function getComments(id: string | number) {
  try {
    const res = await axiosInstance.get(`/comments/${id}`)
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}

export async function getChildsOfComment(parentId: string | number) {
  try {
    const res = await axiosInstance.get(`/comments/get-children/${parentId}`)
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response as never as ServerError
    return {
      success: false,
      message: response.message || 'Internal server error',
      statusCode: axiosError.status,
    }
  }
}
