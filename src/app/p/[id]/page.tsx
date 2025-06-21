'use client'

import { useState, useEffect, useMemo } from 'react'
import { use } from 'react'
import { getPost, PostsResponse, Comment } from '@/app/actions/post'
import PostCard from '@/components/Post/Post'
import { Button } from '@/components/ui/button'
import { getComments } from '@/app/actions/comment'
import { CommentItem } from '@/components/Post/CommentItem'
import { useUser } from '@/hooks/useUser'
import { getTheRoleOfAuth } from '@/app/actions/community' // Import the role function

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
  const [sortBy, setSortBy] = useState<'voteCount' | 'createdAt'>('createdAt')
  const [userRole, setUserRole] = useState<string | null>(null)

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

  useEffect(() => {
    const fetchUserRole = async () => {
      if (authenticatedUser && post) {
        try {
          const roleData = await getTheRoleOfAuth(post.Forum.Community.id)
          console.log(roleData)
          console.log(roleData.data)

          if (roleData && roleData.data) {
            console.log(88)
            setUserRole(roleData.data)
          } else {
            setUserRole(null)
          }
        } catch (err) {
          console.error('Error fetching user role:', err)
          setUserRole(null)
        }
      } else {
        setUserRole(null)
      }
    }

    fetchUserRole()
  }, [authenticatedUser, post])

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      if (sortBy === 'voteCount') {
        return (b.voteCount ?? 0) - (a.voteCount ?? 0)
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
  }, [comments, sortBy])

  const isAuthor = post?.Author.id === Number(authenticatedUser?.id)
  const currentUserId = authenticatedUser?.id?.toString() || null
  const canModerate = userRole === 'OWNER' || userRole === 'MODERATOR'
  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-75"></div>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-wide animate-bounce">
            Loading post...
          </p>
          <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 animate-progress"></div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-red-600 dark:text-red-400">
          <p className="text-lg font-semibold">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-700 dark:text-gray-300">Post not found</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
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

      <div className="mt-12 border-t pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Comments ({comments.length})
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'voteCount' | 'createdAt')
              }
              className="border dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            >
              <option value="createdAt">Newest</option>
              <option value="voteCount">Most Upvoted</option>
            </select>
          </div>
        </div>

        {comments.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-6">
            {sortedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                canModerate={canModerate}
                onCommentChange={fetchComments}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
