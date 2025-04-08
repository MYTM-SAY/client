import * as React from 'react'
import Image from 'next/image'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaYoutube } from 'react-icons/fa'

import Btn from '@/components/ui/Btn'

export default function Page() {
  const bio = `ANDY ELLIOTT'S #1 GROUP FOR
SALES & PERSONAL
DEVELOPMENT`
  const text = `👋Join The ELITE SALES ALLIANCE & Learn How To DOMINATE Your Goals And Become Your
Best Version!

📲You'll get instant Daily VIP Access To The Worlds #1 Fastest Growing Online Leadership
Program & Community.

Here's What You'll Get Today For FREE: 👇

🔥 Learn The Exact Framework Andy Elliott Used To Build A 9-Figure Business, Develop A 
Magnetic Company Culture, And Be Called “Tony Robbin's Greatest Student” In Only 4 Years.

✅ The 5 Step Course To Change Your Life
✅ Free 1-1 Onboarding Call On How To Totally Recreate Yourself!
✅ Andy Elliott's 9 Skills Course
`
  return (
    <div className="flex gap-4 p-2 justify-between">
      <div className="bg-card max-w-[1000px] w-full rounded-lg p-6 space-y-3">
        <h2 className="h2">Frontend community</h2>
        <div className="bg-gray-400 h-[350px] flex items-center justify-center rounded-lg">
          <FaYoutube fontSize={50} />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-gray-400 h-[50px] w-[100px] flex items-center justify-center">
            <FaYoutube fontSize={10} />
          </div>
          <div className="bg-gray-400 h-[50px] w-[100px] flex items-center justify-center">
            <FaYoutube fontSize={10} />
          </div>
          <div className="bg-gray-400 h-[50px] w-[100px] flex items-center justify-center">
            <FaYoutube fontSize={10} />
          </div>
        </div>

        <div className="p-muted" style={{ whiteSpace: 'pre-wrap' }}>
          {text}
        </div>
      </div>
      <div className="bg-card rounded-lg overflow-hidden shrink-0 self-start pb-8 mr-4 mmd:hidden">
        <Image
          src="/Rectangle 76.png"
          className=" border border-gray-300 dark:border-gray-700 mb-2"
          alt="Profile Picture"
          width={300}
          height={100}
        />
        <div className="px-2 space-y-4">
          <h2 className="h4">Community Name</h2>
          <div className="p-muted" style={{ whiteSpace: 'pre' }}>
            {bio}
          </div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/Rectangle 83.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="p font-medium">By Ian Macklin 👑</p>
          </div>
          <div className="flex justify-center space-x-2 text-center border-y mx-2 p-muted">
            <div className="flex-1">
              <p>18.8K</p>
              <p>Members</p>
            </div>
            <div className="border-x px-2 flex-1">
              <p>48</p>
              <p>Online</p>
            </div>
            <div className="flex-1">
              <p>8</p>
              <p>Admins</p>
            </div>
          </div>
          <Btn className="mx-auto w-full py-4">Settings</Btn>
        </div>
      </div>
    </div>
  )
}
