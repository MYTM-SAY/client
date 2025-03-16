/* eslint-disable @next/next/no-img-element */
import Btn from '../ui/Btn'
import { GiExitDoor } from 'react-icons/gi'
import { Earth, GlobeLock, Users, EllipsisIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CommunityCardProps {
  name?: string
  members?: number
  isPublic?: boolean
  creator?: string
  image?: string
}

export default function JoinedCommunityCard(props: CommunityCardProps) {
  return (
    <div className="relative flex flex-col bg-card items-center overflow-hidden rounded-lg justify-between gap-5 min-w-[200px] pb-5">
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-2 right-2 z-10 bg-foreground/70 text-background rounded-sm cursor-pointer h-8 w-8 flex items-center justify-center">
          <EllipsisIcon size={25} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="custom-dropdown-content">
          <DropdownMenuItem className="custom-dropdown-item dropdown-cancel">
            <GiExitDoor />
            Leave the community
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div>
        <img
          src="/download (3).jpeg"
          className="object-cover h-24 w-full"
          alt=""
        />
        <p className="h5 px-5 pt-3 text-center">Software Engineers</p>
      </div>

      <div className="flex items-center gap-3 px-5">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/Rectangle 83.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="p-sm-muted">By Hassan Ezz</p>
      </div>

      <div className="flex flex-col justify-between w-full p-muted px-5">
        <div className="flex justify-around w-full p-muted pb-3">
          <p className="flex gap-1 items-center">
            <Users size={20} />
            13k{' '}
          </p>
          {props.isPublic ? (
            <p className="flex gap-1 items-center">
              <Earth size={20} />
              Public
            </p>
          ) : (
            <p className="flex gap-1 items-center">
              <GlobeLock size={20} />
              Private
            </p>
          )}
        </div>
        <Btn className="w-full p-2 text-white">View</Btn>
      </div>
    </div>
  )
}
