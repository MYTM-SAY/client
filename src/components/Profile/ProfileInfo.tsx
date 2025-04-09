import Btn from '../ui/Btn'
import { FaRegClock, FaCalendarAlt, FaLinkedin, FaGithub } from 'react-icons/fa'
import { SiLeetcode, SiCodeforces } from 'react-icons/si'
import { FaXTwitter } from 'react-icons/fa6'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
const ProfileInfo = () => {
  const text = `Ex-Software Engineer @Bld.ai
3x ACPC Finalist
2x ECPC Medalist 🥈🥉`

  return (
    <div className="flex mlg:w-full flex-col items-center justify-between self-start bg-background border border-foreground rounded-lg py-6 px-12 gap-6 dark-gray-shadow ">
      <div className="flex flex-col items-center justify-center gap-4">
        <Avatar className="rounded-full border border-gray-300 dark:border-gray-700 w-[150px] h-[150px]">
          <AvatarImage src="/pp-fallback.svg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <h1 className="h4">Yousef Hassan</h1>
      </div>
      <div className="flex flex-col gap-8 px-4">
        <div style={{ whiteSpace: 'pre-wrap' }} className="p">
          {text}
        </div>
        <ul className="flex flex-col gap-2 p-sm-muted">
          <li className="flex items-center gap-4">
            <FaRegClock className="" />
            Active 48m ago
          </li>
          <li className="flex items-center gap-4">
            <FaCalendarAlt className="" />
            Joined Oct 14, 2024
          </li>
        </ul>
      </div>
      <div>
        <Btn className="px-10 py-3 bg-accent text-white">Edit Profile</Btn>
      </div>
      <div className="flex justify-between gap-16 ">
        <div className="flex flex-col items-center p-muted">
          <p className="font-semibold">48</p>
          <p>Contributions</p>
        </div>
        <div className="flex flex-col items-center p-muted">
          <p className="font-semibold">5</p>
          <p>Communities</p>
        </div>
      </div>
      <ul className="flex gap-8 p-muted text-xl">
        <li>
          <Link href="https://www.skool.com/adonis-gang">
            <SiLeetcode />
          </Link>
        </li>
        <li>
          <Link href="https://www.skool.com/adonis-gang">
            <SiCodeforces />
          </Link>
        </li>
        <li>
          <Link href="https://www.skool.com/adonis-gang">
            <FaLinkedin />
          </Link>
        </li>
        <li>
          <Link href="https://www.skool.com/adonis-gang">
            <FaGithub />
          </Link>
        </li>
        <li>
          <Link href="https://www.skool.com/adonis-gang">
            <FaXTwitter />
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default ProfileInfo
