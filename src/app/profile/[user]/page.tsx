import React from 'react'
import ContributionGraph from '@/components/Profile/ContributionGraph'
import CommunitiesProfile from '@/components/Profile/CommunitiesProfile'
import ProfileInfo from '@/components/Profile/ProfileInfo'
import ContributionsInCommunityies from '@/components/Profile/ContributionsInCommunityies'


export default async function Page() {
  
  const contributions: number[] = Array.from({ length: 365 }, () =>
    Math.floor(Math.random() * 5),
  )

  return (
    <div className="grid sm:grid-cols-3 gap-5">
      <div className="col-span-2">
        <ContributionGraph contributions={contributions} />
        <CommunitiesProfile />
        <ContributionsInCommunityies />
      </div>
      <ProfileInfo />
    </div>
  )
}

