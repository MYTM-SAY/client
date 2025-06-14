import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import JoinedCommunityCard from '@/components/HomePage/CommunityCardImproved'
import { getJoinedCommunities } from '@/app/actions/community'
import { getUser } from '@/lib/actions/auth'
import { getFav, type FavoriteResponse } from '@/app/actions/community'

export default async function MyCommunitiesPage() {
  const userReq = await getUser()
  if (!userReq.success) return <>Internal server error</>

  const [joinedCommunitiesReq, favReq] = await Promise.all([
    getJoinedCommunities(String(userReq.user.id)),
    getFav(),
  ])

  if (!joinedCommunitiesReq.success) return <>Internal server error</>

  const joinedCommunities = joinedCommunitiesReq.data
  const favoriteCommunities: FavoriteResponse[] = favReq.success
    ? favReq.data
    : []

  const favoriteCommunityIds = new Set<string | number>(
    favoriteCommunities.map((fav: FavoriteResponse) => fav.communityId),
  )

  const getCommunityDetails = (communityId: string | number) => {
    const joined = joinedCommunities.find((j) => j.Community.id === communityId)
    return {
      members: joined ? Number(joined.Community.MembersCount) : 0,
      creator: joined?.Community.Owner?.fullname || 'Unknown',
    }
  }

  return (
    <div className="overflow-y-auto no-scrollbar w-full mx-auto max-w-[1000px]">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="h4">Pending</AccordionTrigger>
          <AccordionContent className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            <p className="text-muted-foreground">No pending communities</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="h4">Favorite</AccordionTrigger>
          <AccordionContent className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            {!favReq.success ? (
              <p className="text-muted-foreground">Error loading favorites</p>
            ) : favoriteCommunities.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <p className="text-muted-foreground text-center">
                  You haven&apos;t added any communities to favorites yet.
                </p>
              </div>
            ) : (
              favoriteCommunities.map((fav) => {
                const { members, creator } = getCommunityDetails(
                  fav.communityId,
                )
                return (
                  <JoinedCommunityCard
                    key={fav.communityId}
                    id={fav.communityId}
                    communityId={fav.communityId} // Pass community ID for role lookup
                    name={fav.name}
                    members={members}
                    isPublic={fav.isPublic}
                    creator={creator}
                    image={fav.logoImgURL}
                    isFavorite={true}
                  />
                )
              })
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="h4">Joined Communities</AccordionTrigger>
          <AccordionContent className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            {joinedCommunities.length === 0 ? (
              <p className="text-muted-foreground">No joined communities</p>
            ) : (
              joinedCommunities.map((comm) => (
                <JoinedCommunityCard
                  key={comm.Community.id}
                  id={comm.Community.id}
                  communityId={comm.Community.id} // Pass community ID for role lookup
                  name={comm.Community.name}
                  members={Number(comm.Community.MembersCount)}
                  isPublic={comm.Community.isPublic}
                  creator={comm.Community.Owner.fullname}
                  image={comm.Community.logoImgURL}
                  isFavorite={favoriteCommunityIds.has(comm.Community.id)}
                />
              ))
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
