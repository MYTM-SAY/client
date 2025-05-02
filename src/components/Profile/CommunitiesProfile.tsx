import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getJoinedCommunities } from '@/app/actions/community'

type CommunityListProps = {
  userId: string
}

export default async function CommunitiesProfile({
  userId,
}: CommunityListProps) {
  const userCommunities = await getJoinedCommunities(userId)
  if (!userCommunities.success) {
    return 'An error has occurred'
  }

  const communities = userCommunities.data.map((d) => ({
    ...d.Community,
    role: d.Role,
  }))

  return (
    <div>
      <p className="h4 mb-4">Communities</p>
      <div className="p-6 flex flex-col gap-10 bg-card  rounded-lg shadow-md">
        {communities.map((community, index) => (
          <div
            key={index}
            className="flex w-full justify-between items-start msm:items-center msm:flex-col "
          >
            <div>
              <div className="flex gap-4 flex-wrap msm:justify-center ">
                <Image
                  src={community.logoImgURL}
                  className="rounded-full border"
                  alt="Community"
                  width={68}
                  height={68}
                />
                <div>
                  <p className="h5">{community.name}</p>
                  <p className="p-muted capitalize">
                    {community.isPublic ? 'Public' : 'Private'} • 167.6k •{' '}
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
