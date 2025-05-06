import PostContent from './PostContent'
import PostActions from './PostActions'
import PostSettingsDropdown from './PostSettingsDropDown'
import Image from 'next/image'
import Link from 'next/link'
import { PostsResponse } from '@/app/actions/post'
import { formatDateTime } from '@/lib/utils'

interface Props {
  post: PostsResponse
  communityId: number | string
  communityName: string
  isAuthor: boolean
}

export default function PostCard({
  post,
  communityId,
  communityName,
  isAuthor,
}: Props) {
  return (
    <div className="relative p-6 rounded-lg bg-card text-foreground shadow">
      {isAuthor && <PostSettingsDropdown />}

      <header className="flex gap-4 items-center">
        <Image
          src="/pp-fallback.svg"
          className="rounded-full"
          alt="Profile Image"
          width={68}
          height={68}
        />
        <div>
          <Link href={`/u/${post?.Author?.username || 'ERROR'}`} className="h4">
            {post?.Author?.fullname || 'ERROR'}
          </Link>
          <p className="p-muted">
            {formatDateTime(post.createdAt)} in{' '}
            <Link href={`/c/${communityId}`} className="font-bold underline">
              {communityName}
            </Link>
          </p>
        </div>
      </header>

      <Link href={`/p/${post.id}`}>
        <PostContent title={post?.title || ''} content={post?.content || ''} />
      </Link>

      <PostActions
        id={post.id}
        votes={post?.voteCounter || 0}
        commentCount={post?.commentsCount || 0}
        title={post.title}
      />
    </div>
  )
}
