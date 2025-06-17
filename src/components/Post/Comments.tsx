'use client'

import { useEffect, useState } from 'react'
import CommentForm from './CommentForm'
import { Comment } from '@/app/actions/post'
interface Props {
  postId: number
  comments?: Comment[]
  setComments?: React.Dispatch<React.SetStateAction<Comment[]>>
}

export default function Comments({ postId, comments, setComments }: Props) {
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

  if (error) {
    return (
      <div className="space-y-6">
        <CommentForm postId={postId} />
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CommentForm
        postId={postId}
        comments={comments}
        setComments={setComments}
      />
    </div>
  )
}
