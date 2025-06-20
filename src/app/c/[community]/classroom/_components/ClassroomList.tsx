'use client'

import ClassroomCard from '@/components/Community/Classroom/ClassroomCard'
import useClassrooms from '@/hooks/useClassroom'

interface ClassroomListProps {
  communityId: string
}

export default function ClassroomList({ communityId }: ClassroomListProps) {
  const { classrooms, isLoading, error } = useClassrooms(communityId)

  if (isLoading) {
    return <div>Loading classrooms...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {classrooms.length === 0 ? (
        <div className="col-span-3 text-center">No classrooms found.</div>
      ) : (
        classrooms.map((classroom) => (
          <ClassroomCard key={classroom.id} classroom={classroom} />
        ))
      )}
    </div>
  )
}
