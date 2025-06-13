'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { getPost, PostsResponse, Comment } from '@/app/actions/post'
import PostCard from '@/components/Post/Post'
import { Button } from '@/components/ui/button'
import { getComments } from '@/app/actions/comment'
import { CommentItem } from '@/components/Post/CommentItem'
import { useUser } from '@/hooks/useUser'
import { getCommunity } from '@/app/actions/community'
import { Community } from '@/types'

interface PageParams {
  id: string
}

export default function Page({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params)

  const [post, setPost] = useState<PostsResponse | null>(null)
  const [community, setCommunity] = useState<Community | null>(null)
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

        const communityReq = await getCommunity(postReq.data.forumId.toString())
        if (!communityReq.success) throw new Error(communityReq.message)

        setCommunity(communityReq.data)

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
  console.log(community)
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

  const isAuthor = post.Author.id === Number(authenticatedUser?.id)
  const currentUserId = authenticatedUser?.id?.toString() || null

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <PostCard
        key={post.id}
        post={post}
        communityId={post.forumId}
        communityName={community?.name || 'Unknown'}
        isAuthor={isAuthor}
        initialVoteStatus={post.voteType}
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
