import PostContent from './PostContent'
import PostActions from './PostActions'
import PostSettingsDropdown from './PostSettingsDropDown'
import Image from 'next/image'
import Link from 'next/link'
import { PostsResponse } from '@/app/actions/post'
import { GetCommunityResponse } from '@/app/actions/community'
import { formatDateTime } from '@/lib/utils'

interface Props {
  post: PostsResponse
  community: GetCommunityResponse
  isAuthor: boolean
}

export default function PostCard({ post, community, isAuthor }: Props) {
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
          <Link href={`/u/${post.Authorfiltered.username}`} className="h4">
            {post.Authorfiltered.fullname}
          </Link>
          <p className="p-muted">
            {formatDateTime(post.createdAt)} in{' '}
            <Link href={`/c/${community.id}`} className="font-bold underline">
              {community.name}
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
