import Image from 'next/image'
import instructorImage from '@/../public/image2.png'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

export default function ReduxCard() {
  return (
    <Link href="/c/1/classroom/vid">
      <div className="flex flex-col justify-between relative overflow-hidden rounded-lg bg-card">
        <div className="relative flex-1 ">
          <Image
            src={instructorImage}
            alt="Instructor"
            objectFit="cover"
            height={350}
          />
        </div>
        <div className="p-4 flex flex-col gap-2 ">
          <h3 className="">Redux Tutorial - Learn Redux from scratch</h3>
          <p className="p-sm-muted">
            Go from beginner to expert in 6 hours. Everything you need to build
            modern apps with Redux.
          </p>
          <div className="relative">
            <p className="absolute top-[50%] translate-y-[-50%] left-2 z-10">
              64%
            </p>
            <Progress value={64} className="bg-gray-300 h-6" />
          </div>
        </div>
      </div>
    </Link>
  )
}
