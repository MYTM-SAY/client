import Image from 'next/image'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Classroom } from '@/types'

interface ClassroomCardProps {
  classroom: Classroom
}

export default function ClassroomCard({ classroom }: ClassroomCardProps) {
  return (
    <Link href={`/c/${classroom.communityId}/classroom/vid`}>
      <div className="flex flex-col justify-between relative overflow-hidden rounded-lg bg-card">
        <div className="relative flex-1 ">
          <Image
            src={classroom.coverImg}
            alt={classroom.name}
            objectFit="cover"
            height={350}
            width={500}
          />
        </div>
        <div className="p-4 flex flex-col gap-2 ">
          <h3 className="">{classroom.name}</h3>
          <p className="p-sm-muted">
            {classroom.description}
          </p>
          <div className="relative">
            <p className="absolute top-[50%] translate-y-[-50%] left-2 z-10">
              {classroom.progress ? `${classroom.progress}%` : '0%'}
            </p>
            <Progress value={classroom.progress || 0} className="bg-gray-300 h-6" />
          </div>
        </div>
      </div>
    </Link>
  )
}
