import React from 'react'
import { ThemeToggle } from '@/components/NavBar/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import Link from 'next/link'
const NavProfile = () => {
  return (
    <div className="flex shrink-0 items-center justify-end gap-4">
      {/* <SignedIn> */}
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="/download (3).jpeg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="custom-dropdown-content">
          <Link href="/profile/AlTarek">
            <DropdownMenuItem className="!cursor-pointer custom-dropdown-item">
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="dropdown-cancel custom-dropdown-item">
            <button>Logout</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* </SignedIn> */}
    </div>
  )
}

export default NavProfile
