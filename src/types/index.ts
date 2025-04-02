import { ReactNode } from 'react'

export type UserFromToken = {
  id: string
  email: string
  username: string
  fullname: string
}

export interface SidebarProps {
  handleOnClick: (event: React.MouseEvent<HTMLDivElement | HTMLLIElement>) => void
  active: string
}

export interface SideBarIconProps {
  children: ReactNode
  href: string
  isActive: boolean
}

export interface ContributionGraphProps {
  contributions: number[]
}

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export interface CommunityCardProps {
  status: string
}
export interface PostContentProps {
  title: string
  content: string
}
export interface ShareButtonProps {
  url?: string
  title?: string
}
export interface GroupProps {
  num: number
}
