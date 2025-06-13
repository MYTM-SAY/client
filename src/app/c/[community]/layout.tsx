import React from 'react'
import CommunityNavBar from '@/components/Community/CommunityNavBar'
import { getCommunity } from '@/app/actions/community'

interface Props {
  params: Promise<{
    community: string
  }>
  children: React.ReactNode
}

export default async function CommunityLayout({ children, params }: Props) {
  const { community: communityId } = await params
  const res = await getCommunity(communityId)

  // TODO: add status code
  if (!res.success) {
    if (res.statusCode === 404) {
      return <>Page not found</>
    }
    return <>Internal server error</>
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="">
        <h2 className="text-4xl text-center font-bold my-10">
          Welcome to {res.data.name}!
        </h2>
      </header>
      <CommunityNavBar /> {children}
    </section>
  )
}
