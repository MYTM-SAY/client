import React from 'react'
import NavProfile from './NavProfile'
import { SidebarTrigger } from '../ui/sidebar'
import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="h-24 w-full border-b mb-5">
      <main className="cont h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <Link href="/" className="text-2xl font-bold">
            LearnVerse
          </Link>
        </div>

        <NavProfile />
      </main>
    </nav>
  )
}
