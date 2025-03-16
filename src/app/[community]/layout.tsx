import React from 'react'
import CommunityNavBar from '@/components/Community/CommunityNavBar'

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="border">
      <CommunityNavBar /> {children}
    </section>
  )
}
