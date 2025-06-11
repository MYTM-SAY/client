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
  posts: PostsResponse[]
  id: number | string
}
export default function ContributionsInCommunities({ posts, id }: Props) {
  const [currentCommunity, setCurrentCommunity] = useState<string>('')

  const userComms = posts.map((p) => ({
    value: p.forumId,
    label: posts.filter((a) => a.forumId === p.forumId).length.toString(),
  })) // TODO: change forum id to be community name

  return (
    <div className="flex flex-col gap-8 w-full mt-10 ">
      <div className="flex-between flex-wrap gap-6 rounded-lg  text-foreground  px-4 py-2">
        <div className="h4 font-medium">
          {currentCommunity} contributions to:
        </div>
        <Select onValueChange={(value) => setCurrentCommunity(value)}>
          <SelectTrigger className="p-lg h-[50px] w-[380px] msm:w-full  bg-card ">
            <SelectValue placeholder="AI Geeks" />
          </SelectTrigger>
          <SelectContent className="bg-card  text-foreground ">
            {userComms.map(({ value, label }) => (
              <SelectItem key={value} value={label} className="p-lg">
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          communityId={post.forumId}
          communityName={"Temp"}
          isAuthor={post.authorId === id}
          initialVoteStatus={post.voteType}
        />
      ))}
    </div>
  )
}

