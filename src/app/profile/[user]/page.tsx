import React from 'react'
import ContributionGraph from '@/components/Profile/ContributionGraph'
import CommunitiesProfile from '@/components/Profile/CommunitiesProfile'
import ProfileInfo from '@/components/Profile/ProfileInfo'
import ContributionsInCommunityies from '@/components/Profile/ContributionsInCommunityies'
import { getUser } from '@/lib/actions/auth'
import { getUserProfileInfo, getUserContributions } from '@/app/actions/profile'
import { getJoinedCommunities } from '@/app/actions/community'
export default async function Page() {
  const contributions: number[] = Array.from({ length: 365 }, () =>
    Math.floor(Math.random() * 5),
  )
  const userReq = await getUser()
  if (!userReq.success) {
    return 'An error has occurred'
  }

  const userInfoReq = await getUserProfileInfo(userReq.user.id)
  const userContributions = await getUserContributions(userReq.user.id)
  const userCommunities = await getJoinedCommunities(userReq.user.id)
  if (!userCommunities.success) {
    return 'An error has occurred'
  }
  const communities = userCommunities.data.map((d) => ({
    ...d.Community,
    role: d.Role,
  }))

  return (
    <div className="grid sm:grid-cols-3 gap-5">
      <div className="col-span-2">
        <ContributionGraph contributions={contributions} />
        <CommunitiesProfile communities={communities} />
        {/* <ContributionsInCommunityies /> */}
      </div>

      <ProfileInfo
        username={userReq.user.username}
        fullname={userReq.user.fullname}
        bio={userInfoReq.data?.bio || ''}
        facebook={userInfoReq.data?.facebook || '#'}
        instagram={userInfoReq.data?.instagram || '#'}
        linkedIn={userInfoReq.data?.linkedin || '#'}
        x={userInfoReq.data?.twitter || '#'}
        youtube={userInfoReq.data?.youtube || '#'}
        profilePic={userInfoReq.data?.profilePictureURL || '#'}
        userContributionCount={
          userContributions.data[0].UserContributions[0].count
        }
        joinedCommuntiesCount={communities.length}
      />
    </div>
  )
}
