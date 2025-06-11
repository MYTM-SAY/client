'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { getPost } from '@/app/actions/post'
import { getAuthenticatedUserDetails } from '@/app/actions/user'
import PostCard from '@/components/Post/Post'
import { Button } from '@/components/ui/button'
import { getComments } from '@/app/actions/comment'
import { CommentItem } from '@/components/Post/CommentItem'
interface PageParams {
  id: string
}

export default function Page({ params }: { params: PageParams }) {
  const unwrappedParams = use(params)
  const { id } = unwrappedParams

  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = async () => {
    try {
      const allComments = await getComments(id)
      setComments(allComments.data || [])
    } catch (err) {
      console.error('Failed to load comments:', err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [postReq, user] = await Promise.all([
          getPost(id),
          getAuthenticatedUserDetails(),
        ])

        if (!postReq.success) {
          throw new Error(postReq.message || 'Error loading post')
        }

        setPost(postReq.data)
        setAuthenticatedUser(user.data)
        await fetchComments()
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Loading post...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-red-500 text-center py-12">
          <p>Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Post not found</p>
        </div>
      </main>
    )
  }

  const isAuthor = post.Author.id === authenticatedUser?.id
  const currentUserId = authenticatedUser?.id || null
  const topLevelComments = comments.filter((c) => c.parentId === null)

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <PostCard
        post={post}
        communityId={post.Forum.Community.id}
        communityName={post.Forum.Community.name}
        isAuthor={isAuthor}
        initialVoteStatus={post.voteType}
      />

      <div className="mt-10 pt-6 border-t">
        <h2 className="text-xl font-bold mb-6">Comments ({comments.length})</h2>

        {topLevelComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-6">
            {topLevelComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onCommentChange={fetchComments}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
