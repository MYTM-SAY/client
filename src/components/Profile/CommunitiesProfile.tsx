'use client'

import React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Role } from '@/types'
type Community = {
  id: string | number
  name: string
  description?: string
  bio?: string
  createdAt?: string
  updatedAt?: string
  coverImgURL?: string
  logoImgURL: string
  ownerId?: number
  isPublic: boolean
  Owner: {
    id: string | number
    fullname: string
    username: string
  }
  MembersCount: number | string
  role: Role
}

type CommunityListProps = {
  communities: Community[]
}

export default function CommunitiesProfile({
  communities,
}: CommunityListProps) {
  const [profileImageError, setProfileImageError] = useState(false)
  const IMG_FALLBACK = '/imgFallBack.581a9fe3.png'
  return (
    <div>
      <p className="h4 mb-4">Communities</p>
      <div className="p-6 flex flex-col gap-10 bg-card  rounded-lg shadow-md">
        {communities.map((community) => (
          <div
            key={community.id}
            className="flex w-full justify-between items-start msm:items-center msm:flex-col "
          >
            <div>
              <div className="flex gap-4 flex-wrap msm:justify-center ">
                <Image
                  src={
                    !profileImageError && community.logoImgURL
                      ? community.logoImgURL
                      : IMG_FALLBACK
                  }
                  className="rounded-full"
                  alt="Community"
                  width={68}
                  height={68}
                  onError={() => setProfileImageError(true)}
                />
                <div>
                  <p className="h5">{community.name}</p>
                  <p className="p-muted capitalize">
                    {community.isPublic ? 'Public' : 'Private'} •{' '}
                    {community.MembersCount} •{' '}
                    {(community.role as never as string).toLowerCase()}
                  </p>
                </div>
              </div>
              <p className="mt-4 p-lg-muted">{community?.description || ''}</p>
            </div>
            <Link
              href={'/c/' + community.id}
              className="px-10 py-2 msm:mt-4 text-white bg-accent rounded-lg"
            >
              Visit
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
