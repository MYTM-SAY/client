'use client'

import Btn from '../ui/Btn'
import { FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IoLogoFacebook } from 'react-icons/io'
import { FaYoutube } from 'react-icons/fa'
import { FiInstagram } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

interface ProfileInfoProps {
  username: string
  fullname: string
  bio: string
  facebook?: string
  instagram?: string
  linkedIn?: string
  x?: string
  youtube?: string
  profilePic?: string
  userContributionCount: number
  joinedCommuntiesCount: number
}
const ProfileInfo = ({
  username,
  fullname,
  bio,
  facebook = '#',
  instagram = '#',
  linkedIn = '#',
  x = '#',
  youtube = '#',
  profilePic,
  userContributionCount,
  joinedCommuntiesCount,
}: ProfileInfoProps) => {
  const text = bio
  const router = useRouter()
  const handleClick = () => {
    router.push(`/profile/${username}/update-profile`)
  }
  return (
    <div className="flex mlg:w-full flex-col items-center justify-between self-start bg-background border border-foreground rounded-lg py-6 px-12 gap-6 dark-gray-shadow ">
      <div className="flex flex-col items-center justify-center gap-4">
        <Avatar className="rounded-full border border-gray-300 dark:border-gray-700 w-[150px] h-[150px]">
          <AvatarImage src={profilePic} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <h1 className="h4">{fullname}</h1>
        <p className="p-muted">{username}</p>
      </div>
      <div className="flex flex-col gap-8 px-4">
        <div style={{ whiteSpace: 'pre-wrap' }} className="p">
          {text}
        </div>
      </div>
      <div>
        <Btn onClick={handleClick} className="px-10 py-3 bg-accent text-white">
          Edit Profile
        </Btn>
      </div>
      <div className="flex justify-between gap-16 ">
        <div className="flex flex-col items-center p-muted">
          <p className="font-semibold">{userContributionCount}</p>
          <p>Contributions</p>
        </div>
        <div className="flex flex-col items-center p-muted">
          <p className="font-semibold">{joinedCommuntiesCount}</p>
          <p>Communities</p>
        </div>
      </div>
      <ul className="flex gap-8 p-muted text-xl">
        <li>
          <Link href={facebook}>
            <IoLogoFacebook />
          </Link>
        </li>
        <li>
          <Link href={instagram}>
            <FiInstagram />
          </Link>
        </li>
        <li>
          <Link href={linkedIn}>
            <FaLinkedin />
          </Link>
        </li>
        <li>
          <Link href={youtube}>
            <FaYoutube />
          </Link>
        </li>
        <li>
          <Link href={x}>
            <FaXTwitter />
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default ProfileInfo
