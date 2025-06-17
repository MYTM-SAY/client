'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { getPost, PostsResponse, Comment } from '@/app/actions/post'
import PostCard from '@/components/Post/Post'
import { Button } from '@/components/ui/button'
import { getComments } from '@/app/actions/comment'
import { CommentItem } from '@/components/Post/CommentItem'
import { useUser } from '@/hooks/useUser'
import { Community } from '@/types'

interface PageParams {
  id: string
}

export default function Page({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params)

  const [post, setPost] = useState<PostsResponse | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const { user: authenticatedUser } = useUser()
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

        const postReq = await getPost(id)
        if (!postReq.success) throw new Error(postReq.message)
        setPost(postReq.data)

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
          <div className="flex flex-col items-center justify-center">
            {/* Modern gradient pulse animation */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-75"></div>
            </div>

            {/* Animated text with staggered letters */}
            <p className="mt-6 text-lg font-medium text-gray-700 flex justify-center space-x-1">
              {['L', 'o', 'a', 'd', 'i', 'n', 'g', ' ', 'p', 'o', 's', 't'].map(
                (char, i) => (
                  <span
                    key={i}
                    className="animate-wave inline-block"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {char}
                  </span>
                ),
              )}
            </p>

            {/* Progress bar */}
            <div className="mt-4 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 animate-progress"></div>
            </div>
          </div>
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

  const isAuthor = post.Author.id === Number(authenticatedUser?.id)
  const currentUserId = authenticatedUser?.id?.toString() || null
  console.log(post)
  console.log(comments)

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <PostCard
        key={post.id}
        post={post}
        communityId={post.forumId}
        communityName={post.Forum.Community.name}
        isAuthor={isAuthor}
        initialVoteStatus={post.voteType}
        comments={comments}
        setComments={setComments}
      />

      <div className="mt-10 pt-6 border-t">
        <h2 className="text-xl font-bold mb-6">Comments ({comments.length})</h2>

        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
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
