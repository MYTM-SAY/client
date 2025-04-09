import React from 'react'
import CommunityNavBar from '@/components/Community/CommunityNavBar'

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <header className="">
        <h2 className="text-4xl text-center font-bold my-10">Welcome to the YYYYYY Community!</h2>
      </header>
      <CommunityNavBar /> {children}
    </section>
  )
}
