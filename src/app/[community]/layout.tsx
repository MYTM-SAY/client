import React from 'react'
import CommunityNavBar from '@/components/Community/CommunityNavBar'

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 pr-8">
      <CommunityNavBar /> {children}
    </section>
  )
}
