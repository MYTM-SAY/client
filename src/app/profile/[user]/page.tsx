import React from 'react'
import ContributionGraph from '@/components/Profile/ContributionGraph'
import CommunitiesProfile from '@/components/Profile/CommunitiesProfile'
import ProfileInfo from '@/components/Profile/ProfileInfo'
import ContributionsInCommunities from '@/components/Profile/ContributionsInCommunityies'
import { getUser } from '@/lib/actions/auth'
import { getUserProfileInfo, getUserContributions } from '@/app/actions/profile'
import { getJoinedCommunities } from '@/app/actions/community'
import { getAllPostsOfUserUsingId } from '@/app/actions/user'
export default async function Page() {
  // TODO: remove this mock data and use the actual data from the API
  const contributions: number[] = Array.from({ length: 365 }, () =>
    Math.floor(Math.random() * 5),
  )

  const userReq = await getUser()
  if (!userReq.success) {
    return 'An error has occurred'
  }

  const userInfoReq = await getUserProfileInfo(userReq.user.id)
  if (!userInfoReq.success) {
    console.log('An error has occurred (user info)')
  }

  const userContributions = await getUserContributions(userReq.user.id)
  console.log('HELLO', userContributions)
  if (!userContributions.success) {
    return 'An error has occurred (user contributions)'
  }

  const userCommunities = await getJoinedCommunities(userReq.user.id)
  if (!userCommunities.success) {
    return 'An error has occurred (user comms)'
  }

  const postsReq = await getAllPostsOfUserUsingId(userReq.user.id)
  if (!postsReq.success) {
    return 'An error has occurred (posts)'
  }

  console.log(postsReq.data)

  return (
    <div className="grid sm:grid-cols-3 gap-5">
      <div className="col-span-2">
        <ContributionGraph contributions={contributions} />
        <CommunitiesProfile
          communities={userCommunities.data.map((d) => ({
            ...d.Community,
            role: d.Role,
          }))}
        />
        <ContributionsInCommunities
          posts={postsReq.data}
          id={userReq.user.id}
        />
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
          userContributions.success
            ? userContributions?.data[0]?.UserContributions[0]?.count
            : 0
        }
        joinedCommuntiesCount={userCommunities.data.length}
      />
    </div>
  )
}
