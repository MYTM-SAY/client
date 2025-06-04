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
import { getTheRoleOfAuth } from '@/app/actions/community'
import { getFav } from '@/app/actions/community'
export default async function MyCommunitiesPage() {
  const userReq = await getUser()
  if (!userReq.success) return <>Internal server error</>

  const [roleReq, joinedCommunitiesReq, favReq] = await Promise.all([
    getTheRoleOfAuth(userReq.user.id),
    getJoinedCommunities(userReq.user.id),
    getFav(),
  ])

  if (!roleReq.success || !joinedCommunitiesReq.success)
    return <>Internal server error</>

  const joinedCommunities = joinedCommunitiesReq.data
  const favoriteCommunities = favReq.success ? favReq.data : []

  const getCommunityDetails = (communityId: number) => {
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
            {/* TODO: Add pending communities when API is available */}
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
                  You haven't added any communities to favorites yet.
                </p>
              </div>
            ) : (
              favoriteCommunities.map((fav) => {
                const { members, creator } = getCommunityDetails(
                  fav.communityId,
                )
                return (
                  <JoinedCommunityCard
                    key={fav.Community.id}
                    id={fav.Community.id}
                    userRole={roleReq.data}
                    name={fav.Community.name}
                    members={members}
                    isPublic={fav.Community.isPublic}
                    creator={creator}
                    image={fav.Community.logoImgURL}
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
                  userRole={roleReq.data}
                  name={comm.Community.name}
                  members={Number(comm.Community.MembersCount)}
                  isPublic={comm.Community.isPublic}
                  creator={comm.Community.Owner.fullname}
                  image={comm.Community.logoImgURL}
                />
              ))
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
