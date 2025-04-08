'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const CommunityNavBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState<string>('forum')

  const navItems = [
    'Forum',
    'Classroom',
    'Calendar',
    'Leaderboards',
    'Members',
    'About',
  ]

  const baseClasses =
    'cursor-pointer relative before:absolute before:w-0 before:h-1 before:bg-accent before:-bottom-4 hover:before:w-full before:transition-all before:duration-700'

  const handleOnClick = (item: string) => {
    // Get the base path (everything up to the first two segments)
    const pathParts = pathname?.split('/').slice(0, 2)
    const basePath = pathParts?.join('/') || ''
    router.push(`${basePath}/${item.toLowerCase()}`)
  }

  useEffect(() => {
    if (!pathname) return

    const parts = pathname.split('/')
    // If there's a third part, use it as active, otherwise use 'forum'
    const currentActive = parts[2] || 'forum'
    setActive(currentActive)
  }, [pathname])

  return (
    <ul className="flex justify-evenly bg-card rounded-md py-4 w-full">
      {navItems.map((item) => (
        <li
          onClick={() => handleOnClick(item)}
          key={item}
          className={`${baseClasses} ${
            active === item.toLowerCase() ? 'text-accent before:w-full' : ''
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

export default CommunityNavBar
