import React from 'react'
import NavProfile from './NavProfile'
import { SidebarTrigger } from '../ui/sidebar'
import Link from 'next/link'
import { IoMdPlanet } from 'react-icons/io'
import { GiGraduateCap } from 'react-icons/gi'

export default function NavBar() {
  return (
    <nav className="h-24 w-full border-b mb-5">
      <main className="cont h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger />

          <div className="flex items-center space-x-2">
            <div className="relative">
              <IoMdPlanet
                fontSize={60}
                color="#3B82F6"
                className="animate-spin-slow"
              />
              <GiGraduateCap
                fontSize={42}
                color="#1E40AF"
                className="absolute left-[10px] top-[-12px] animate-bounce"
              />
            </div>

            <div className="text-left">
              <Link href={'/'} className="h4">
                LearnVerse
              </Link>
              <p className="text-gray-400 text-xs">Learn Together</p>
            </div>
          </div>
        </div>

        <NavProfile />
      </main>
    </nav>
  )
}
