import PostCard from '@/components/Post/Post'
import CreatePostModal from './CreatePostModal'
import { getPosts } from '@/app/actions/post'
import { GetCommunityResponse } from '@/app/actions/community'

interface Props {
  forumId: number
  community: GetCommunityResponse
  authedUserId: string | number
}

export default async function Forum({
  forumId,
  community,
  authedUserId,
}: Props) {
  const postsReq = await getPosts(forumId)
  if (!postsReq.success) {
    return <>Internal Server Error</> // TODO: put the 500 page
  }

  const sortedPosts = postsReq.data.sort(
    (a, b) => b.voteCounter - a.voteCounter,
  )

  const rposts = sortedPosts.map((post) => (
    <PostCard
      key={post.id}
      post={post}
      communityId={community.id}
      communityName={community.name}
      isAuthor={authedUserId == post.Author.id}
      initialVoteStatus={post.voteType}
    />
  ))

  return (
    <div className="">
      <div className="col-span-2">
        <div className="flex-center gap-1 px-4 py-2 rounded-lg border w-full mb-5">
          <CreatePostModal fid={forumId} />
        </div>
        <div className="space-y-3">{rposts}</div>
      </div>
    </div>
  )
}
