
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
import { getUser } from '@/lib/actions/auth'
import { getJoinedCommunities } from '@/app/actions/community'

const AppSidebar = async () => {
  
  const userRequest = await getUser()
  if (!userRequest.success) {
    return <>Internal server error</>
  }

  const joinedCommsRequest = await getJoinedCommunities(userRequest.user.id)
  if (!joinedCommsRequest.success) {
    return <>Internal server error</>
  }

  const communities = joinedCommsRequest.data

  // const arr = Array.from({ length: 5 }, (_, i) => `community-${i + 1}`)

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="p-0">
        <SidebarMenu className="flex flex-col items-center gap-7 py-7">
          <SideBarIcon href="/" isActive={false}>
            <Home size={30} />
          </SideBarIcon>

          <SideBarIcon
            href="/my-communities"
            isActive={false}
          >
            <Users size={30} />
          </SideBarIcon>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="mt-7 no-scrollbar">
        <SidebarMenu className="gap-6 flex-col-center">
          {communities.map((i, idx) => (
            <SideBarIcon
              key={idx}
              href={`/c/${i.Community.id}`}
              isActive={false}
            >
              <Image
                src="/pp-fallback.svg"
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
          <SideBarIcon href="/create" isActive={false}>
            <BsFillPlusCircleFill className="!w-8 !h-8" />
          </SideBarIcon>
          <SideBarIcon href="/discover" isActive={false}>
            <FaCompass className="!w-8 !h-8" />
          </SideBarIcon>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
