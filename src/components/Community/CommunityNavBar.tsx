'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getTheRoleOfAuth } from '@/app/actions/community'

export default function CommunityNavBar() {
  const { community } = useParams()
  const pathname = usePathname()
  const currentPage = pathname.split('/').pop() || ''
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRole() {
      if (typeof community === 'string') {
        const res = await getTheRoleOfAuth(community)
        if (res.success) {
          setRole(res.data)
        }
      }
    }
    fetchRole()
  }, [community])

  const navItems = [
    { name: 'Forum', path: '' },
    { name: 'Classroom', path: 'classroom' },
    { name: 'Calendar', path: 'calendar' },
    { name: 'Leaderboards', path: 'leaderboards' },
    { name: 'Members', path: 'members' },
    { name: 'About', path: 'about' },
    ...(role === 'OWNER' || role === 'MODERATOR'
      ? [{ name: 'Admin', path: 'admin' }]
      : []),
  ]

  return (
    <div className="flex justify-evenly bg-card rounded-md py-4 w-full">
      {navItems.map((item) => {
        const href = `/c/${community}${item.path ? `/${item.path}` : ''}`
        const isActive =
          (item.path === '' && pathname === href) ||
          (item.path !== '' && currentPage === item.path)

        return (
          <Link
            key={item.path}
            href={href}
            className={`cursor-pointer relative before:absolute before:w-0 before:h-1 before:bg-accent before:-bottom-4 hover:before:w-full before:transition-all before:duration-700 ${
              isActive ? 'text-accent before:w-full' : ''
            }`}
          >
            {item.name}
          </Link>
        )
      })}
    </div>
  )
}
