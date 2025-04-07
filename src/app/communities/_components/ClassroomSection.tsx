'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import useClassrooms from '@/hooks/useClassroom'
interface ClassroomSectionProps {
  communityId: string
}

export default function ClassroomSection({
  communityId,
}: ClassroomSectionProps) {
  const { classrooms: courses, isLoading, error } = useClassrooms(communityId)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Classroom</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>
                Instructor: {course.name} | Duration: {course.progress}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{course.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span>{course.progress} students enrolled</span>
              <Button>Enroll</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
