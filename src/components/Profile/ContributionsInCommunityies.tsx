'use client'

import React, { useState } from 'react'
import Post from '../Post/Post'
import { PostsResponse } from '@/app/actions/post'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  communities: {
    communityName: string
    communityId: number
  }[]
  posts: PostsResponse[]
  id: number | string
}

export default function ContributionsInCommunities({
  communities,
  posts,
  id,
}: Props) {
  const [currentCommunityId, setCurrentCommunityId] = useState<number | null>(
    null,
  )

  // Get community name from its ID
  const getCommunityName = (id: number) =>
    communities.find((c) => c.communityId === id)?.communityName || 'Unknown'

  const filteredPosts =
    currentCommunityId === null
      ? []
      : posts.filter((post) => post.forumId === currentCommunityId)

  return (
    <div className="flex flex-col gap-8 w-full mt-10 ">
      <div className="flex-between flex-wrap gap-6 rounded-lg text-foreground px-4 py-2">
        <div className="h4 font-medium">
          {currentCommunityId !== null
            ? `${getCommunityName(currentCommunityId)} contributions to:`
            : 'Select a community'}
        </div>
        <Select onValueChange={(value) => setCurrentCommunityId(Number(value))}>
          <SelectTrigger className="p-lg h-[50px] w-[380px] msm:w-full bg-card ">
            <SelectValue placeholder="Choose a community" />
          </SelectTrigger>
          <SelectContent className="bg-card text-foreground ">
            {communities.map(({ communityId, communityName }) => (
              <SelectItem
                key={communityId}
                value={communityId.toString()}
                className="p-lg"
              >
                {communityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredPosts.map((post) => (
        <Post
          key={post.id}
          post={post}
          communityId={post.forumId}
          communityName={getCommunityName(post.forumId)}
          isAuthor={post.authorId === id}
          initialVoteStatus={post.voteType}
        />
      ))}
    </div>
  )
}
