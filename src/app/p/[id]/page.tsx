import { getPost } from '@/app/actions/post'
import type { Comment } from '@/app/actions/post'
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
    <>
      <div className="flex gap-4 items-center p-5 dark:bg-gray-800 bg-gray-200 rounded-lg">
        <Image
          src={
            comment.Author?.UserProfile?.profilePictureURL || '/pp-fallback.svg'
          }
          alt="Profile Image"
          width={68}
          height={68}
          className="rounded-full"
        />
        <div>
          <Link href={`/u/${comment.Author.username}`} className="h4">
            {comment?.Author?.fullname || 'ERROR'}
          </Link>
          <p className="p-muted">{comment.content}</p>
        </div>
      </div>

      <div className="ml-5">
        {childrenArray
          .filter((c) => c.parentId == comment.id)
          .map((c) => (
            <CommentCard key={c.id} comment={c} childrenArray={[]} />
          ))}
      </div>
    </>
  )
}

export default async function Page({ params: { id } }: Props) {
  const postReq = await getPost(id)
  if (!postReq.success) {
    return 'An error has occurred'
  }

  const post = postReq.data
  const comments = post?.Comments || []

  return (
    <main>
      <h2 className="text-4xl font-bold">{post.title}</h2>
      <p className="p-muted text-xl pt-5">{post.content}</p>

      <hr className='border-t w-full my-5' />

      {comments.length ? (
        <>
          <h4 className="mb-5 font-bold text-2xl">Comments:</h4>
          <ul className="space-y-3">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                childrenArray={comments}
              />
            ))}
          </ul>
        </>
      ) : (
        <p className="p-muted">
          No comments to read...
        </p>
      )}
    </main>
  )
}
