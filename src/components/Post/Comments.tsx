'use client'

import { useEffect, useState } from 'react'
import { Comment } from '@/app/actions/comment'
import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import CommentForm from './CommentForm'
interface Props {
  postId: number
}

export default function Comments({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchComments() {
      if (!postId) {
        setError('Invalid post ID')
        return
      }
    }
    fetchComments()
  }, [postId])

  const handleNewComment = () => {}

  if (error) {
    return (
      <div className="space-y-6">
        <CommentForm postId={postId} onCommentAdded={handleNewComment} />
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CommentForm postId={postId} onCommentAdded={handleNewComment} />
    </div>
  )
}
