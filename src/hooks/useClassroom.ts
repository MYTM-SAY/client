import { useState, useEffect } from 'react'
import { instance } from '@/lib/utils/axios'
import { ApiResponseError, ApiResponse, Classroom } from '@/types'

interface CreateClassroom {
  name: string
  description: string
  coverImg: string
  communityId: number
}

type UpdateClassroom = Omit<CreateClassroom, 'communityId'>

const useClassrooms = (communityId: string) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setIsLoading(true)
        const response: ApiResponse<Classroom[]> = await instance.get(
          `/classrooms/communities/${communityId}`,
        )
        setClassrooms(response.data.data)
      } catch (err) {
        const error = err as ApiResponseError
        setError(error.response?.data?.message)
        setClassrooms([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchClassrooms()
  }, [communityId])

  async function createClassroom(classroom: CreateClassroom) {
    try {
      const response: ApiResponse<Classroom> = await instance.post(
        '/classrooms',
        classroom,
      )
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
    }
  }

  async function updateClassroom(id: string, classroom: UpdateClassroom) {
    try {
      const response: ApiResponse<Classroom> = await instance.put(
        `/classrooms/${id}`,
        classroom,
      )
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
    }
  }

  async function deleteClassroom(id: string) {
    try {
      const response: ApiResponse<Classroom> = await instance.delete(
        `/classrooms/${id}`,
      )
      return response.data.data
    } catch (err) {
      const error = err as ApiResponseError
      setError(error.response?.data?.message)
    }
  }

  return {
    classrooms,
    isLoading,
    error,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  }
}

export const useClassroomDetails = (classroomId: string) => {
  // Type for courseContent array
  type CourseContentSection = {
    section: number
    title: string
    completed: number
    total: number
    duration: number
    lessons: {
      id: number
      title: string
      duration: number
      completed: boolean
      notes: string
      materials: {
        id: number
        materialType: string
        fileUrl: string
        createdAt: string
        updatedAt: string
        lessonId: number
        duration?: number
      }[]
    }[]
  }

  interface Material {
    id: number
    materialType: string
    fileUrl: string
    createdAt: string
    updatedAt: string
    lessonId: number
    duration?: number
  }

  interface Lesson {
    id: number
    name: string
    notes: string
    sectionId: number
    createdAt: string
    updatedAt: string
    Materials: Material[]
    isCompleted: boolean
    duration: number
  }

  interface Section {
    id: number
    name: string
    description: string
    classroomId: number
    Lessons: Lesson[]
    createdAt: string
    updatedAt: string
  }

  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courseContent, setCourseContent] = useState<CourseContentSection[]>([])

  useEffect(() => {
    if (!classroomId) return
    const fetchClassroom = async () => {
      setIsLoading(true)
      try {
        const response = await instance.get(
          `/classrooms/${classroomId}?section=true&lesson=true`,
        )
        const apiData = response.data.data

        // Map API response to CourseContentSection[]
        const sections: CourseContentSection[] = Array.isArray(apiData.Sections)
          ? apiData.Sections.map((section: Section, idx: number) => {
              const lessonsArr = Array.isArray(section.Lessons)
                ? section.Lessons
                : []
              const completedCount = lessonsArr.filter(
                (lesson: Lesson) => lesson.isCompleted,
              ).length

              // Calculate total duration from materials first, fallback to lesson duration
              const totalDuration = lessonsArr.reduce(
                (acc: number, lesson: Lesson) => {
                  if (
                    Array.isArray(lesson.Materials) &&
                    lesson.Materials.length > 0
                  ) {
                    const materialDuration = lesson.Materials.reduce(
                      (matAcc: number, material: Material) =>
                        matAcc + (material.duration || 0),
                      0,
                    )
                    return (
                      acc +
                      (materialDuration > 0
                        ? materialDuration
                        : lesson.duration || 0)
                    )
                  }
                  return acc + (lesson.duration || 0)
                },
                0,
              )

              return {
                section: idx + 1,
                title: section.name || '',
                completed: completedCount,
                total: lessonsArr.length,
                duration: totalDuration,
                lessons: lessonsArr.map((lesson: Lesson) => {
                  // Calculate lesson duration from materials, fallback to lesson duration
                  let lessonDuration = lesson.duration || 0
                  if (
                    Array.isArray(lesson.Materials) &&
                    lesson.Materials.length > 0
                  ) {
                    const materialDuration = lesson.Materials.reduce(
                      (matAcc: number, material: Material) =>
                        matAcc + (material.duration || 0),
                      0,
                    )
                    lessonDuration =
                      materialDuration > 0 ? materialDuration : lessonDuration
                  }

                  return {
                    id: lesson.id,
                    title: lesson.name || '',
                    duration: lessonDuration,
                    completed: !!lesson.isCompleted,
                    notes: lesson.notes || '',
                    materials: Array.isArray(lesson.Materials)
                      ? lesson.Materials.map((mat: Material) => ({
                          id: mat.id,
                          materialType: mat.materialType,
                          fileUrl: mat.fileUrl,
                          createdAt: mat.createdAt,
                          updatedAt: mat.updatedAt,
                          lessonId: mat.lessonId,
                          duration: mat.duration,
                        }))
                      : [],
                  }
                }),
              }
            })
          : []
        setClassroom({
          id: apiData.id,
          name: apiData.name,
          description: apiData.description,
          createdAt: apiData.createdAt,
          updatedAt: apiData.updatedAt,
          coverImg: apiData.coverImg,
          communityId: String(apiData.communityId),
          progress: 0, // You can calculate progress if needed
          sections: Array.isArray(apiData.Sections) ? apiData.Sections : [],
        })
        setCourseContent(sections)
      } catch (err) {
        const error = err as ApiResponseError
        setError(error.response?.data?.message)
        setClassroom(null)
        setCourseContent([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchClassroom()
  }, [classroomId])

  // Add the toggle lesson completion function
  const toggleLessonCompletion = async (lessonId: number) => {
    try {
      const response = await instance.patch(
        `/lessons/${lessonId}/toggle-completed`,
      )
      const { isCompleted } = response.data.data

      // Update the courseContent state with the new completion status
      setCourseContent((prevContent) =>
        prevContent.map((section) => ({
          ...section,
          lessons: section.lessons.map((lesson) =>
            lesson.id === lessonId
              ? { ...lesson, completed: isCompleted }
              : lesson,
          ),
          // Recalculate completed count for the section
          completed: section.lessons.filter((lesson) =>
            lesson.id === lessonId ? isCompleted : lesson.completed,
          ).length,
        })),
      )

      return isCompleted
    } catch (err) {
      const error = err as ApiResponseError
      setError(
        error.response?.data?.message || 'Failed to toggle lesson completion',
      )
      throw error
    }
  }

  return { classroom, courseContent, isLoading, error, toggleLessonCompletion }
}

export default useClassrooms
