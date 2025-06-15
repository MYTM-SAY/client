'use client'

import { useState } from 'react'
import {
  PlusIcon,
  X,
  BookOpen,
  Calendar,
  FileText,
  Video,
  Link,
  Trash2,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import CreateClassroomForm from './CreateClassroomForm'
import { Classroom, Lesson, MaterialType, Section } from '@/types'
import Image from 'next/image'
import { instance } from '@/lib/utils/axios'
import CreateSectionForm from './CreateSectionForm'
import CreateLessonForm from './CreateLessonForm'
import { useToast } from '@/hooks/use-toast'

const ClassroomManagement = ({
  communityId,
  classrooms: initialClassrooms,
}: {
  communityId: string
  classrooms: Classroom[]
}) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms)
  const [showClassroomForm, setShowClassroomForm] = useState(false)
  const [showSectionForm, setShowSectionForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [expandedSections, setExpandedSections] = useState<number[]>([])

  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null,
  )
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const { toast } = useToast()

  const toggleSectionExpansion = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    )
  }

  const handleNewCreateClassroom = (classroom: Classroom) => {
    setClassrooms((prev) => [...prev, classroom])
    setShowClassroomForm(false)
  }

  const handleNewCreateSection = (section: Section) => {
    if (!selectedClassroom) return
    setSelectedClassroom({
      ...selectedClassroom,
      sections: [...(selectedClassroom?.sections || []), section],
    })
    setShowSectionForm(false)
  }

  const handleSelectClassroom = async (classroomId: number) => {
    const classroom = classrooms.find((c) => c.id === classroomId)
    if (classroom) {
      // First set the classroom with empty sections to prevent undefined errors
      setSelectedClassroom({
        ...classroom,
        sections: classroom.sections || [],
      })
    }

    try {
      const { data: sections } = await instance.get(
        `/sections/classrooms/${classroomId}`,
      )

      if (sections.success && sections.data) {
        // Load lessons for each section, but don't fail if individual lessons fail
        const lessonPromises = sections.data.map(async (section: Section) => {
          try {
            const { data: lessons } = await instance.get(
              `/lessons/sections/${section.id}`,
            )
            return {
              ...section,
              lessons: lessons.data || [],
            }
          } catch (error) {
            console.log(
              `Error loading lessons for section ${section.id}:`,
              error,
            )
            // Return section without lessons if lesson loading fails
            return {
              ...section,
              lessons: [],
            }
          }
        })

        const sectionsWithLessons = await Promise.all(lessonPromises)

        if (classroom) {
          setSelectedClassroom({
            id: classroom.id,
            name: classroom.name,
            description: classroom.description,
            createdAt: classroom.createdAt,
            updatedAt: classroom.updatedAt,
            coverImg: classroom.coverImg,
            communityId: classroom.communityId,
            progress: classroom.progress,
            sections: sectionsWithLessons,
          })
        }
      } else {
        console.log('No sections data or request failed:', sections)
      }
    } catch (error) {
      console.log('Error fetching classroom sections:', error)
      // Keep the classroom selected even if sections fail to load
    }
  }

  const handleDeleteClassroom = async (id: number) => {
    try {
      const res = await instance.delete(`/classrooms/${id}`)

      if (res.data.success) {
        setClassrooms(classrooms.filter((c) => c.id !== id))
        if (selectedClassroom?.id === id) {
          setSelectedClassroom(null)
        }
        toast({
          title: 'Success',
          description: 'Classroom deleted successfully',
        })
      }
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          'Failed to delete classroom. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteSection = async (id: number) => {
    if (!selectedClassroom) return
    try {
      const res = await instance.delete(`/sections/${id}`)
      if (res.data.success) {
        const updatedClassroom = {
          ...selectedClassroom,
          sections:
            selectedClassroom.sections?.filter((s) => s.id !== id) || [],
        }

        setClassrooms(
          classrooms.map((c) =>
            c.id === selectedClassroom.id ? updatedClassroom : c,
          ),
        )
        setSelectedClassroom(updatedClassroom)
        if (selectedSection?.id === id) {
          setSelectedSection(null)
        }
        toast({
          title: 'Success',
          description: 'Section deleted successfully',
        })
      }
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          'Failed to delete section. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteLesson = async (sectionId: number, lessonId: number) => {
    if (!selectedClassroom) return
    try {
      const res = await instance.delete(`/lessons/${lessonId}`)
      if (res.data.success) {
        const updatedSections =
          selectedClassroom.sections?.map((section) => {
            if (section.id === sectionId) {
              return {
                ...section,
                lessons: section.lessons.filter((l) => l.id !== lessonId),
              }
            }
            return section
          }) || []

        const updatedClassroom = {
          ...selectedClassroom,
          sections: updatedSections,
        }

        setClassrooms(
          classrooms.map((c) =>
            c.id === selectedClassroom.id ? updatedClassroom : c,
          ),
        )
        setSelectedClassroom(updatedClassroom)

        if (selectedSection?.id === sectionId) {
          const updatedSection = updatedSections.find((s) => s.id === sectionId)
          setSelectedSection(updatedSection || null)
        }
        toast({
          title: 'Success',
          description: 'Lesson deleted successfully',
        })
      }
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          'Failed to delete lesson. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleNewCreateLesson = (lesson: Lesson) => {
    if (!selectedSection || !selectedClassroom) return

    setSelectedSection({
      ...selectedSection,
      lessons: [...(selectedSection?.lessons || []), lesson],
    })

    const updatedClassroom = {
      ...selectedClassroom,
      sections:
        selectedClassroom.sections?.map((section) =>
          section.id === selectedSection.id
            ? {
                ...selectedSection,
                lessons: [...(selectedSection?.lessons || []), lesson],
              }
            : section,
        ) || [],
    }

    setSelectedClassroom(updatedClassroom)
    setShowLessonForm(false)
  }

  const getMaterialIcon = (materialType: MaterialType) => {
    switch (materialType) {
      case MaterialType.VIDEO:
        return <Video className="h-4 w-4 text-red-500" />
      case MaterialType.DOC:
        return <FileText className="h-4 w-4 text-blue-500" />
      case MaterialType.FILE:
        return <Link className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatNotesForDisplay = (notes: string[]): string => {
    if (!notes || notes.length === 0) return ''
    // Join multiple notes with bullet points for better readability
    return notes.filter((note) => note.trim()).join(' • ')
  }

  // Helper function to safely get material from lesson
  const getLessonMaterial = (lesson: Lesson) => {
    // Handle both Materials (plural) and Material (singular) properties
    if (lesson.Materials) {
      return lesson.Materials
    }
    if (lesson.Material) {
      return lesson.Material
    }
    return null
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Classroom Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Create and manage your community&apos;s learning spaces
          </p>
        </div>
        <button
          onClick={() => setShowClassroomForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <PlusIcon className="h-5 w-5" />
          Create Classroom
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Classroom List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Classrooms ({classrooms.length})
              </h2>
            </div>

            <div className="p-6">
              {classrooms.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No classrooms yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Create your first classroom to get started
                  </p>
                  <button
                    onClick={() => setShowClassroomForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Create Classroom
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {classrooms.map((classroom) => (
                    <div
                      key={classroom.id}
                      onClick={() => handleSelectClassroom(classroom.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedClassroom?.id === classroom.id
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {classroom.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            {classroom.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(classroom.createdAt)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClassroom(classroom.id)
                          }}
                          className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Classroom Details */}
        <div className="lg:col-span-2">
          {!selectedClassroom ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
              <div className="text-center py-16">
                <BookOpen className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Select a classroom
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a classroom from the list to view and manage its
                  content
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Classroom Header */}
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-t-xl overflow-hidden">
                  <Image
                    src={selectedClassroom.coverImg}
                    alt={selectedClassroom.name}
                    width={800}
                    height={200}
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedClassroom.name}
                  </h2>
                  <p className="text-white/90">
                    {selectedClassroom.description}
                  </p>
                </div>
              </div>

              {/* Classroom Stats */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedClassroom.sections?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Sectionsss
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {selectedClassroom.sections?.reduce(
                        (acc, section) => acc + section.lessons.length,
                        0,
                      ) || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Lessons
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Course Content
                  </h3>
                  <button
                    onClick={() => setShowSectionForm(true)}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add Section
                  </button>
                </div>

                {selectedClassroom?.sections?.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No sections yet
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Add your first section to organize your content
                    </p>
                    <button
                      onClick={() => setShowSectionForm(true)}
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add Section
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedClassroom?.sections?.map(
                      (section, sectionIndex) => (
                        <div
                          key={section.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                          {/* Section Header */}
                          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    toggleSectionExpansion(section.id)
                                  }
                                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  {expandedSections.includes(section.id) ? (
                                    <ChevronDown className="h-5 w-5" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5" />
                                  )}
                                </button>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white">
                                    {sectionIndex + 1}. {section.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {section.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                                  {section.lessons?.length || 0} lessons
                                </span>
                                <button
                                  onClick={() => {
                                    setSelectedSection(section)
                                    setShowLessonForm(true)
                                  }}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 rounded transition-colors"
                                  title="Add lesson"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSection(section.id)
                                  }
                                  className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 rounded transition-colors"
                                  title="Delete section"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Section Content */}
                          {expandedSections.includes(section.id) && (
                            <div className="p-4 bg-white dark:bg-gray-800">
                              {(section.lessons?.length || 0) === 0 ? (
                                <div className="text-center py-8">
                                  <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    No lessons in this section yet
                                  </p>
                                  <button
                                    onClick={() => {
                                      setSelectedSection(section)
                                      setShowLessonForm(true)
                                    }}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                                  >
                                    Add your first lesson
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {section.lessons?.map(
                                    (lesson, lessonIndex) => {
                                      const material = getLessonMaterial(lesson)
                                      if (!material) return null

                                      return (
                                        <div
                                          key={lesson.id}
                                          className="flex items-start gap-4 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-sm transition-shadow"
                                        >
                                          <div className="flex-shrink-0 mt-1">
                                            {getMaterialIcon(
                                              material.materialType,
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                              <div className="flex-1">
                                                <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                                                  {lessonIndex + 1}.{' '}
                                                  {lesson.name}
                                                </h5>
                                                {material.materialType ===
                                                MaterialType.DOC ? (
                                                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                    {(() => {
                                                      // Handle both array and string formats for backward compatibility
                                                      const notesText =
                                                        Array.isArray(
                                                          lesson.notes,
                                                        )
                                                          ? formatNotesForDisplay(
                                                              lesson.notes,
                                                            )
                                                          : lesson.notes || ''
                                                      return (
                                                        notesText.substring(
                                                          0,
                                                          100,
                                                        ) +
                                                        (notesText.length > 100
                                                          ? '...'
                                                          : '')
                                                      )
                                                    })()}
                                                  </p>
                                                ) : (
                                                  <a
                                                    href={material.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline mb-2 block"
                                                  >
                                                    View resource →
                                                  </a>
                                                )}
                                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                  <span>
                                                    Created{' '}
                                                    {formatDate(
                                                      lesson.createdAt,
                                                    )}
                                                  </span>
                                                  <span className="capitalize">
                                                    {material.materialType?.toLowerCase() ||
                                                      'unknown'}
                                                  </span>
                                                </div>
                                              </div>
                                              <button
                                                onClick={() =>
                                                  handleDeleteLesson(
                                                    section.id,
                                                    lesson.id,
                                                  )
                                                }
                                                className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 rounded transition-colors flex-shrink-0"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    },
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showClassroomForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Create New Classroom
              </h3>
              <button
                onClick={() => setShowClassroomForm(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <CreateClassroomForm
                handleNewClassroom={handleNewCreateClassroom}
                setShowClassroomForm={setShowClassroomForm}
                communityId={parseInt(communityId)}
              />
            </div>
          </div>
        </div>
      )}

      {showSectionForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Section
              </h3>
              <button
                onClick={() => setShowSectionForm(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <CreateSectionForm
                handleNewSection={handleNewCreateSection}
                setShowSectionForm={setShowSectionForm}
                classroomId={selectedClassroom?.id || 0}
              />
            </div>
          </div>
        </div>
      )}

      {showLessonForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Lesson
              </h3>
              <button
                onClick={() => setShowLessonForm(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <CreateLessonForm
                handleNewLesson={handleNewCreateLesson}
                setShowLessonForm={setShowLessonForm}
                sectionId={selectedSection?.id || 0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClassroomManagement
