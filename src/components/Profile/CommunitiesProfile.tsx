import React from 'react'
import Image from 'next/image'
import Btn from '../ui/Btn'

type Community = {
  id: number
  name: string
  description: string
  bio: string
  coverImgURL: string
  logoImgURL: string
  isPublic: boolean
  ownerId: number
  createdAt: string
  updatedAt: string
}
type CommunityListProps = {
  userCommunities: Community[]
}

const CommunitiesProfile = ({ userCommunities }: CommunityListProps) => {
  console.log(userCommunities)
  return (
    <div>
      <p className="h4 mb-4">Communities</p>
      <div className="p-6 flex flex-col gap-10 bg-card  rounded-lg shadow-md">
        {userCommunities.map((community, index) => (
          <div
            key={index}
            className="flex w-full justify-between items-start msm:items-center msm:flex-col "
          >
            <div>
              <div className="flex gap-4 flex-wrap msm:justify-center ">
                <Image
                  src={community.logoImgURL}
                  className="rounded-lg"
                  alt="Community"
                  width={68}
                  height={68}
                />
                <div>
                  <p className="h5">{community.name}</p>
                  <p className="p-muted">Private • 167.6k • Admin</p>
                </div>
              </div>
              <p className="mt-4 p-lg-muted">{community.bio}</p>
            </div>
            <Btn className="px-10 py-2 msm:mt-4 text-white bg-accent">
              Visit
            </Btn>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommunitiesProfile
