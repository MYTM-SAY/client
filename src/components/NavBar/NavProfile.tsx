import { ThemeToggle } from '@/components/NavBar/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import Link from 'next/link'
import { getUser, signOutAction } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'

const NavProfile = async () => {
  const userReq = await getUser()
  
  const handleSignOut = async () => {
    'use server'
    await signOutAction()
    redirect('/sign-in')
  }

  if (!userReq.success) {
    return "An error has occurred"
  }

  return (
    <div className="flex shrink-0 items-center justify-end gap-4">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="/pp-fallback.svg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="custom-dropdown-content">
          <Link href={`/profile/${userReq.user.username}`}>
            <DropdownMenuItem className="!cursor-pointer custom-dropdown-item">
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="dropdown-cancel custom-dropdown-item">
            <form action={handleSignOut}>
              <button type="submit">Logout</button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default NavProfile
