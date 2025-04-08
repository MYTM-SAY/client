'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { FaCompass } from 'react-icons/fa6'
import { Home, Users } from 'lucide-react'
import { BsFillPlusCircleFill } from 'react-icons/bs'

import Image from 'next/image'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import SideBarIcon from './SideBarIcon'

const AppSidebar = () => {
  const pathname = usePathname()

  const arr = Array.from({ length: 100 }, (_, i) => `community-${i + 1}`)

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="p-0">
        <SidebarMenu className="flex flex-col items-center gap-7 py-7">
          <SideBarIcon href="/" isActive={pathname === '/'}>
            <Home size={30} />
          </SideBarIcon>

          <SideBarIcon
            href="/my-communities"
            isActive={pathname === '/my-communities'}
          >
            <Users size={30} />
          </SideBarIcon>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="mt-7 no-scrollbar">
        <SidebarMenu className="gap-6 flex-col-center">
          {arr.map((i, idx) => (
            <SideBarIcon
              key={idx}
              href={`/${i}`}
              isActive={pathname.startsWith(`/${i}`)}
            >
              <Image
                src="/download (3).jpeg"
                width={56}
                height={56}
                alt="Community"
                className="!w-14 !h-14 rounded-full"
              />
            </SideBarIcon>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-0">
        <SidebarMenu className="py-4 gap-8 flex-col-center">
          <SideBarIcon href="/create" isActive={pathname === '/create'}>
            <BsFillPlusCircleFill className="!w-8 !h-8" />
          </SideBarIcon>
          <SideBarIcon href="/discover" isActive={pathname === '/discover'}>
            <FaCompass className="!w-8 !h-8" />
          </SideBarIcon>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
