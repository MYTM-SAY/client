import { ReactNode } from 'react'
import Link from 'next/link'
import { SidebarMenuItem } from '@/components/ui/sidebar'

interface SideBarIconProps {
  children: ReactNode
  href: string
  isActive: boolean
}

const SideBarIcon = ({ children, href, isActive }: SideBarIconProps) => {
  return (
    <SidebarMenuItem
      className={`relative w-full flex-center  ${
        isActive &&
        'before:h-8  before:w-2 before:pointer-events-none before:transition-all before:duration-300 before:ease-in-out  flex-center cursor-pointer   before:-left-1   before:bg-gray-900 dark:before:bg-white before:rounded-full before:abs-vertical-center '
      }`}
    >
      <Link href={href}>{children}</Link>
    </SidebarMenuItem>
  )
}

export default SideBarIcon
