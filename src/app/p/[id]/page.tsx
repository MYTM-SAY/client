import { getPost } from '@/app/actions/post'
import type { Comment } from '@/app/actions/post'
import { getAuthenticatedUserDetails } from '@/app/actions/user'
import PostCard from '@/components/Post/Post'
import CommentCard from '@/components/Post/CommentCard'

interface Props {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const postReq = await getPost(id)
  const authenticatedUser = await getAuthenticatedUserDetails()

  if (!postReq.success) {
    return <div className="text-red-500">Error loading post</div>
  }

  const post = postReq.data
  const isAuthor = post.Author.id === authenticatedUser.data?.id
  const comments = post?.Comments || []

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <PostCard
        post={post}
        communityId={post.Forum.Community.id}
        communityName={post.Forum.Community.name}
        isAuthor={isAuthor}
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
                  isAuthor={comment.authorId === authenticatedUser.data?.id}
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
