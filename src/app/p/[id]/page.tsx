import { getPost } from '@/app/actions/post'
import type { Comment } from '@/app/actions/post'
import { getAuthenticatedUserDetails } from '@/app/actions/user'
import PostCard from '@/components/Post/Post'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  params: {
    id: string
  }
}

function CommentCard({
  comment,
  childrenArray,
}: {
  comment: Comment
  childrenArray: Comment[]
}) {
  return (
    <div className="mb-4">
      <div className="flex gap-4 items-start p-4 rounded-lg bg-card shadow">
        <Image
          src={
            comment.Author?.UserProfile?.profilePictureURL || '/pp-fallback.svg'
          }
          alt="Profile Image"
          width={48}
          height={48}
          className="rounded-full mt-1 flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <Link
              href={`/u/${comment.Author.username}`}
              className="font-medium hover:underline"
            >
              {comment?.Author?.fullname || 'ERROR'}
            </Link>
            <span className="text-sm text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-1 text-foreground">{comment.content}</p>
        </div>
      </div>

      {childrenArray.filter((c) => c.parentId === comment.id).length > 0 && (
        <div className="ml-12 mt-2 border-l-2 border-border pl-4">
          {childrenArray
            .filter((c) => c.parentId === comment.id)
            .map((c) => (
              <CommentCard
                key={c.id}
                comment={c}
                childrenArray={childrenArray}
              />
            ))}
        </div>
      )}
    </div>
  )
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
