'use client'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

export default function CommunityNavBar() {
  const { community } = useParams()
  const pathname = usePathname()

  return (
    <div className="flex justify-evenly bg-card rounded-md py-4 w-full">
      <Link
        href={`/${community}`}
        className={`cursor-pointer relative before:absolute before:w-0 before:h-1 before:bg-accent before:-bottom-4 hover:before:w-full before:transition-all before:duration-700 ${
          pathname.split('/').length === 2 ? 'text-accent before:w-full' : ''
        }`}
      >
        Forum
      </Link>
      <Link
        href={`/${community}/classroom`}
        className={`cursor-pointer relative before:absolute before:w-0 before:h-1 before:bg-accent before:-bottom-4 hover:before:w-full before:transition-all before:duration-700 ${
          pathname.split('/').at(-1) === 'classroom' ? 'text-accent before:w-full' : ''
        }`}
      >
        Classroom
      </Link>
      <Link
        href={`/${community}/calendar`}
        className={`cursor-pointer relative before:absolute before:w-0 before:h-1 before:bg-accent before:-bottom-4 hover:before:w-full before:transition-all before:duration-700 ${
          pathname.split('/').at(-1) === 'calendar' ? 'text-accent before:w-full' : ''
        }`}
      >
        Calendar
      </Link>
      <Link
        href={`/${community}/leaderboards`}
        className={`cursor-pointer relative before:absolute before:w-0 before:h-1 before:bg-accent before:-bottom-4 hover:before:w-full before:transition-all before:duration-700 ${
          pathname.split('/').at(-1) === 'leaderboards' ? 'text-accent before:w-full' : ''
        }`}
      >
        Leaderboards
      </Link>
      <Link
        href={`/${community}/members`}
        className={`cursor-pointer relative before:absolute before:w-0 before:h-1 before:bg-accent before:-bottom-4 hover:before:w-full before:transition-all before:duration-700 ${
          pathname.split('/').at(-1) === 'members' ? 'text-accent before:w-full' : ''
        }`}
      >
        Members
      </Link>
      <Link
        href={`/${community}/about`}
        className={`cursor-pointer relative before:absolute before:w-0 before:h-1 before:bg-accent before:-bottom-4 hover:before:w-full before:transition-all before:duration-700 ${
          pathname.split('/').at(-1) === 'about' ? 'text-accent before:w-full' : ''
        }`}
      >
        About
      </Link>
    </div>
  )
}
