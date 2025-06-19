import * as React from 'react'
import Image from 'next/image'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { getCommunity } from '../../../actions/community'
import { getUserProfileInfo } from '@/app/actions/profile'
import { getUserByID } from '@/app/actions/user'
import { getMods } from '../../../actions/community'
import JoinCommunityButton from './_components/JoinCommunityButton'

interface Props {
  params: Promise<{
    community: string
  }>
}

export default async function Page({ params }: Props) {
  const { community: communityId } = await params
  const communityInfo = await getCommunity(communityId)
  if (!communityInfo.success) {
    return 'An error has occurred'
  }
  const modsReq = await getMods(communityId)
  if (!modsReq.success) {
    return 'An error has occurred'
  }
  console.log(communityInfo)
  const bio = communityInfo.data.bio
  const text = communityInfo.data.description
  const ownerImg = await getUserProfileInfo(communityInfo.data.ownerId)
  const ownerName = await getUserByID(communityInfo.data.ownerId)
  return (
    <div className="max-w-[1300px] mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        <div className="bg-card/50 backdrop-blur-sm w-full rounded-2xl p-8 space-y-6 shadow-lg border border-accent/20 hover:border-accent/30 transition-all duration-300">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent animate-gradient">
            {communityInfo.data.name}
          </h2>
          <p
            className={`text-sm font-medium px-3 py-1 rounded-full w-fit ${
              communityInfo.data.isPublic
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {communityInfo.data.isPublic
              ? 'Public Community'
              : 'Private Community'}
          </p>

          <div className="bg-gradient-to-br from-accent/20 to-accent/5 h-[350px] flex items-center justify-center rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
            <Image
              src={communityInfo.data.coverImgURL}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              alt="Profile Picture"
              width={600}
              height={350}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {communityInfo.data.Tags?.map((tag) => (
              <div
                key={tag.id}
                className="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium hover:bg-accent/20 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {tag.name}
              </div>
            ))}
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p
              className="text-muted-foreground leading-relaxed hover:text-foreground transition-colors duration-300"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {text}
            </p>
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden shrink-0 self-start lg:w-[350px] shadow-lg border border-accent/20 hover:border-accent/30 transition-all duration-300">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src={communityInfo.data.logoImgURL}
              className="w-full h-[200px] object-cover transform group-hover:scale-105 transition-all duration-500"
              alt="Profile Picture"
              width={350}
              height={200}
            />
          </div>
          <div className="px-6 py-4 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                {communityInfo.data.name}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed hover:text-foreground transition-colors duration-300">
                {bio}
              </p>
            </div>
            <div className="flex items-center gap-3 group">
              <Avatar className="h-12 w-12 ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all duration-300">
                <AvatarImage
                  src={
                    ownerImg.success
                      ? ownerImg.data.profilePictureURL
                      : '/Rectangle 83.png'
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg text-foreground group-hover:text-accent/80 transition-colors duration-300">
                  By {ownerName.success ? ownerName.data.username : 'Unknown'}
                  👑
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center border-y py-4">
              <div className="group">
                <p className="text-2xl font-semibold group-hover:text-accent transition-colors duration-300">
                  {communityInfo.data.membersCount}
                </p>
                <p className="text-sm text-muted-foreground group-hover:text-accent/80 transition-colors duration-300">
                  Members
                </p>
              </div>
              <div className="border-x group">
                <p className="text-2xl font-semibold group-hover:text-accent transition-colors duration-300">
                  {communityInfo.data.onlineMembers}
                </p>
                <p className="text-sm text-muted-foreground group-hover:text-accent/80 transition-colors duration-300">
                  Online
                </p>
              </div>
              <div className="group">
                <p className="text-2xl font-semibold group-hover:text-accent transition-colors duration-300">
                  {modsReq.data}
                </p>
                <p className="text-sm text-muted-foreground group-hover:text-accent/80 transition-colors duration-300">
                  Moderators
                </p>
              </div>
            </div>
            <JoinCommunityButton
              communityId={communityId}
              userRole={
                communityInfo.data.role as unknown as
                  | 'OWNER'
                  | 'MEMBER'
                  | 'MODERATOR'
                  | null
              }
              isPending={communityInfo.data.isPendingRequest}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
