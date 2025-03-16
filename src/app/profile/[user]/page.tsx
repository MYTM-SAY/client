import React from 'react'
import ContributionGraph from '@/components/Profile/ContributionGraph'
import CommunitiesProfile from '@/components/Profile/CommunitiesProfile'
import ProfileInfo from '@/components/Profile/ProfileInfo'
import ContributionsInCommunityies from '@/components/Profile/ContributionsInCommunityies'
const page = () => {
  const contributions: number[] = Array.from({ length: 365 }, () =>
    Math.floor(Math.random() * 5),
  )

  return (
    <div className="flex w-full pt-[50px] flex-1 px-4 gap-4  mlg:flex-col   ">
      <div className="mx-auto flex-1  mlg:order-2 w-full max-w-[1000px]">
        <ContributionGraph contributions={contributions} />
        <CommunitiesProfile />
        <ContributionsInCommunityies />
      </div>
      <ProfileInfo />
    </div>
  )
}

export default page
