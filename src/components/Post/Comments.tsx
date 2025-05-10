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

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={
                  comment.Author.UserProfile?.profilePictureURL ||
                  '/pp-fallback.svg'
                }
                alt={`${comment.Author.fullname}'s profile picture`}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <Link
                  href={`/profile/${comment.Author.username}`}
                  className="font-semibold hover:underline"
                >
                  {comment.Author.fullname}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(comment.createdAt)}
                </p>
              </div>
            </div>
            <p className="text-foreground">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
