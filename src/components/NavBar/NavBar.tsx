import React from 'react'
import NavProfile from './NavProfile'
import { SidebarTrigger } from '../ui/sidebar'
import Link from 'next/link'

export default function NavBar() {
  return (
    <div className="container p-0 px-5 mx-auto flex items-center justify-between h-24 w-screen mb-10 border-b">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Link href="/" className="text-2xl font-bold">
          LearnVerse
        </Link>
      </div>

      <NavProfile />
    </div>
  )
}
