import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PostCard from '@/components/Post/Post'
import CreatePostModal from './CreatePostModal'
import type { Post } from '@/types'

interface Props {
  posts: Post[]
}

export default async function Forum({ posts }: Props) {
  const rposts = posts.map((post) => <PostCard key={post.id} post={post} />)

  // TODO: to the backend team we need the PP

  return (
    <div className="">
      <div className="col-span-2">
        <div className="flex-center gap-1 px-4 py-2 rounded-lg border-[2px] border-foreground w-full mb-5">
          <Avatar>
            <AvatarImage src="/pp-fallback.svg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <CreatePostModal fid={posts[0].forumId} />
        </div>
        <div className="space-y-3">{rposts}</div>
      </div>
    </div>
  )
}
