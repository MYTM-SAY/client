'use client'

import { useState, useEffect } from 'react'
import { use } from 'react' // Import the use hook
import { getPost } from '@/app/actions/post'
import { getAuthenticatedUserDetails } from '@/app/actions/user'
import PostCard from '@/components/Post/Post'
import CommentCard from '@/components/Post/CommentCard'
import { type Comment } from '@/app/actions/comment'
import { Button } from '@/components/ui/button' // Make sure to import your Button component

interface PageParams {
  id: string
}

export default function Page({ params }: { params: PageParams }) {
  const unwrappedParams = use(params)
  const { id } = unwrappedParams

  const [post, setPost] = useState<any>(null)
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const postReq = await getPost(id)
        const user = await getAuthenticatedUserDetails()

        if (!postReq.success) {
          throw new Error(postReq.message || 'Error loading post')
        }

        setPost(postReq.data)
        setAuthenticatedUser(user.data)
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

  const handleNewReply = (newReply: Comment & { parentId?: number }) => {
    if (!post) return

    setPost({
      ...post,
      Comments: [...post.Comments, newReply],
    })
  }

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

  const comments = post?.Comments || []
  const isAuthor = post.Author.id === authenticatedUser?.id
  const currentUserId = authenticatedUser?.id || null

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <PostCard
        post={post}
        communityId={post.Forum.Community.id}
        communityName={post.Forum.Community.name}
        isAuthor={isAuthor}
        initialVoteStatus={post.voteType}
      />

      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
        </div>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments
              .filter((c) => !c.parentId)
              .map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  childrenArray={comments}
                  isAuthor={comment.authorId === currentUserId}
                  currentUserId={currentUserId}
                  onNewReply={handleNewReply}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </section>
    </main>
  )
}
