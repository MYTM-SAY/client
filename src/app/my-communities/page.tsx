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
export default async function MyCommunitiesPage() {
  const userReq = await getUser()
  if (!userReq.success) {
    return <>Internal server error</>
  }
  const roleReq = await getTheRoleOfAuth(userReq.user.id)
  if (!roleReq.success) {
    return <>Internal server error</>
  }
  const joinedCommunitiesReq = await getJoinedCommunities(userReq.user.id)
  if (!joinedCommunitiesReq.success) {
    return <>Internal server error</>
  }

  const joinedCommunities = joinedCommunitiesReq.data

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
            {/* TODO: Add favorite communities when API is available */}
            <p className="text-muted-foreground">No favorite communities</p>
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
