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
  const userReq = await getUser()
  if (!userReq.success) {
    return 'An error has occurred'
  }

  const userInfoReq = await getUserProfileInfo(userReq.user.id)
  if (!userInfoReq.success) {
    console.log('An error has occurred (user info)')
  }

  const userContributions = await getUserContributions(userReq.user.id)
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

  const currentYear = new Date().getFullYear()
  const isLeapYear =
    (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
    currentYear % 400 === 0
  const daysInYear = isLeapYear ? 366 : 365

  const contributionsArray = new Array(daysInYear).fill(0)

  if (userContributions.data[0]?.UserContributions) {
    userContributions.data[0].UserContributions.forEach(
      ({ dateOnly, count }: { dateOnly: string; count: number }) => {
        const date = new Date(dateOnly)
        if (date.getUTCFullYear() === currentYear) {
          const startOfYear = new Date(Date.UTC(currentYear, 0, 1))
          const diffDays = Math.floor(
            (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
          )
          if (diffDays >= 0 && diffDays < daysInYear) {
            contributionsArray[diffDays] = count
          }
        }
      },
    )
  }

  return (
    <div className="grid sm:grid-cols-3 gap-5">
      <div className="col-span-2">
        <ContributionGraph contributions={contributionsArray} />
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
