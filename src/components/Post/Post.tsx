import PostContent from './PostContent'
import PostActions from './PostActions'
import PostSettingsDropdown from './PostSettingsDropDown'
import Image from 'next/image'
import Link from 'next/link'
import { PostsResponse } from '@/app/actions/post'
import { GetCommunityResponse } from '@/app/actions/community'

interface Props {
  post: PostsResponse
  community: GetCommunityResponse
}

export default function PostCard({ post, community }: Props) {
  return (
    <div className="relative p-6 rounded-lg bg-card text-foreground shadow">
      <PostSettingsDropdown />

      {/* header */}
      <div className="flex gap-4 items-center">
        <Image
          src="/pp-fallback.svg"
          className="rounded-full"
          alt="Profile Image"
          width={68}
          height={68}
        />
        <div>
          <Link href={`/u/temp-user`} className="h4">
            {post.Authorfiltered.fullname}
          </Link>
          <p className="p-muted">
            6h ago in{' '}
            <Link href={`/c/${community.id}`} className="font-bold underline">
              {community.name}
            </Link>
          </p>
        </div>
      </div>

      <PostContent title={post?.title || ''} content={post?.content || ''} />
      <PostActions votes={post?.voteCounter || 0} commentCount={post?.commentsCount || 0} />
    </div>
  )
}
