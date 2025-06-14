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
  ChevronDown
} from 'lucide-react'
import CreateClassroomForm from './CreateClassroomForm'
import { Classroom, Lesson, MaterialType, Section } from '@/types'
import Image from 'next/image'
import { instance } from '@/lib/utils/axios'
import CreateSectionForm from './CreateSectionForm'
import CreateLessonForm from './CreateLessonForm'

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

  const toggleSectionExpansion = (sectionId: number) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
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
        sections: classroom.sections || []
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
            const { data: lessons } = await instance.get(`/lessons/sections/${section.id}`)
            return {
              ...section,
              lessons: lessons.data || [],
            }
          } catch (error) {
            console.log(`Error loading lessons for section ${section.id}:`, error)
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
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteSection = async (id: number) => {
    if (!selectedClassroom) return
    try {
      const res = await instance.delete(`/sections/${id}`)
      if (res.data.success) {
        const updatedClassroom = {
          ...selectedClassroom,
          sections: selectedClassroom.sections?.filter((s) => s.id !== id) || [],
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
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteLesson = async (sectionId: number, lessonId: number) => {
    if (!selectedClassroom) return
    try {
      const res = await instance.delete(`/lessons/${lessonId}`)
      if (res.data.success) {
        const updatedSections = selectedClassroom.sections?.map((section) => {
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
      }
    } catch (error) {
      console.log(error)
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
      sections: selectedClassroom.sections?.map((section) =>
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
      day: 'numeric'
    })
  }

  const formatNotesForDisplay = (notes: string[]): string => {
    if (!notes || notes.length === 0) return ''
    // Join multiple notes with bullet points for better readability
    return notes.filter(note => note.trim()).join(' • ')
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
          <h1 className="text-3xl font-bold text-gray-900">Classroom Management</h1>
          <p className="text-gray-600 mt-1">Create and manage your community&apos;s learning spaces</p>
        </div>
        <button
          onClick={() => setShowClassroomForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <PlusIcon className="h-5 w-5" />
          Create Classroom
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Classroom List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Classrooms ({classrooms.length})
              </h2>
            </div>

            <div className="p-6">
      {classrooms.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No classrooms yet</h3>
                  <p className="text-gray-500 mb-6">Create your first classroom to get started</p>
          <button
            onClick={() => setShowClassroomForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{classroom.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{classroom.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(classroom.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {classroom.sections?.length || 0} sections
                            </span>
                          </div>
                        </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClassroom(classroom.id)
                  }}
                          className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex items-center justify-center">
              <div className="text-center py-16">
                <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a classroom</h3>
                <p className="text-gray-500">Choose a classroom from the list to view and manage its content</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Classroom Header */}
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl overflow-hidden">
                  <Image
                    src={selectedClassroom.coverImg}
                    alt={selectedClassroom.name}
                    width={800}
                    height={200}
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedClassroom.name}</h2>
                  <p className="text-white/90">{selectedClassroom.description}</p>
                </div>
              </div>

              {/* Classroom Stats */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedClassroom.sections?.length || 0}</div>
                    <div className="text-sm text-gray-600">Sections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedClassroom.sections?.reduce((acc, section) => acc + section.lessons.length, 0) || 0}
                    </div>
                    <div className="text-sm text-gray-600">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedClassroom.progress}%</div>
                    <div className="text-sm text-gray-600">Progress</div>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Course Content</h3>
            <button
              onClick={() => setShowSectionForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
                    <PlusIcon className="h-4 w-4" />
              Add Section
            </button>
          </div>

          {selectedClassroom?.sections?.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h4>
                    <p className="text-gray-500 mb-6">Add your first section to organize your content</p>
              <button
                onClick={() => setShowSectionForm(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                      Add Section
              </button>
            </div>
          ) : (
                  <div className="space-y-4">
                    {selectedClassroom?.sections?.map((section, sectionIndex) => (
                <div
                  key={section.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {/* Section Header */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleSectionExpansion(section.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {expandedSections.includes(section.id) ? (
                                  <ChevronDown className="h-5 w-5" />
                                ) : (
                                  <ChevronRight className="h-5 w-5" />
                                )}
                              </button>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {sectionIndex + 1}. {section.name}
                                </h4>
                                <p className="text-sm text-gray-600">{section.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                {section.lessons?.length || 0} lessons
                              </span>
                      <button
                        onClick={() => {
                          setSelectedSection(section)
                          setShowLessonForm(true)
                        }}
                                className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                                title="Add lesson"
                      >
                                <PlusIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                                title="Delete section"
                      >
                                <Trash2 className="h-4 w-4" />
                      </button>
                            </div>
                    </div>
                  </div>

                        {/* Section Content */}
                        {expandedSections.includes(section.id) && (
                          <div className="p-4">
                            {(section.lessons?.length || 0) === 0 ? (
                              <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 mb-4">No lessons in this section yet</p>
                                <button
                                  onClick={() => {
                                    setSelectedSection(section)
                                    setShowLessonForm(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Add your first lesson
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {section.lessons?.map((lesson, lessonIndex) => {
                                  const material = getLessonMaterial(lesson)
                                  if (!material) return null
                                  
                                  return (
                                    <div
                                      key={lesson.id}
                                      className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                                    >
                                      <div className="flex-shrink-0 mt-1">
                                        {getMaterialIcon(material.materialType)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h5 className="font-medium text-gray-900 mb-1">
                                              {lessonIndex + 1}. {lesson.name}
                                            </h5>
                                            {material.materialType === MaterialType.DOC ? (
                                              <p className="text-sm text-gray-600 mb-2">
                                                {(() => {
                                                  // Handle both array and string formats for backward compatibility
                                                  const notesText = Array.isArray(lesson.notes) 
                                                    ? formatNotesForDisplay(lesson.notes)
                                                    : lesson.notes || ''
                                                  return notesText.substring(0, 100) + (notesText.length > 100 ? '...' : '')
                                                })()}
                                              </p>
                                            ) : (
                                              <a
                                                href={material.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline mb-2 block"
                                              >
                                                View resource →
                                              </a>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                              <span>Created {formatDate(lesson.createdAt)}</span>
                                              <span className="capitalize">
                                                {material.materialType?.toLowerCase() || 'unknown'}
                                              </span>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => handleDeleteLesson(section.id, lesson.id)}
                                            className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors flex-shrink-0"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                  )}
                </div>
              ))}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Create New Classroom</h3>
              <button
                onClick={() => setShowClassroomForm(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Add New Section</h3>
              <button
                onClick={() => setShowSectionForm(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Add New Lesson</h3>
              <button
                onClick={() => setShowLessonForm(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
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
