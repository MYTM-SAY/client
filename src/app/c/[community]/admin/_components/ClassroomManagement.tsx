'use client'

import { useState } from 'react'
import { PlusIcon, X } from 'lucide-react'
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

  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null,
  )
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)

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
      setSelectedClassroom(classroom)
    }
    const { data: sections } = await instance.get(
      `/sections/classrooms/${classroomId}`,
    )
    const lessonPromises = sections.data.map(async (l: Section) => {
      const { data: lessons } = await instance.get(`/lessons/sections/${l.id}`)

      return {
        ...l,
        lessons: lessons.data,
      }
    })
    const sectionsWithLessons = await Promise.all(lessonPromises)
    if (sections.success && classroom) {
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
          sections: selectedClassroom.sections.filter((s) => s.id !== id),
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
        const updatedSections = selectedClassroom.sections.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              lessons: section.lessons.filter((l) => l.id !== lessonId),
            }
          }
          return section
        })

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
      sections: selectedClassroom.sections.map((section) =>
        section.id === selectedSection.id
          ? {
              ...selectedSection,
              lessons: [...(selectedSection?.lessons || []), lesson],
            }
          : section,
      ),
    }

    setSelectedClassroom(updatedClassroom)
    setShowLessonForm(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Classroom Management</h2>
        <button
          onClick={() => setShowClassroomForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Classroom
        </button>
      </div>

      {/* Classroom list */}
      {classrooms.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No classrooms created yet.</p>
          <button
            onClick={() => setShowClassroomForm(true)}
            className="mt-4 text-blue-500 underline"
          >
            Create your first classroom
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className={`border rounded-lg p-4 cursor-pointer ${
                selectedClassroom?.id === classroom.id
                  ? 'border-blue-500 bg-blue-50'
                  : ''
              }`}
              onClick={() => handleSelectClassroom(classroom.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{classroom.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClassroom(classroom.id)
                  }}
                  className="text-red-500 hover:bg-red-100 p-1 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Image
                src={classroom.coverImg}
                alt={classroom.name}
                width={200}
                height={200}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 text-sm mt-2">
                {classroom.description}
              </p>
              <p className="text-gray-500 text-sm mt-4">
                Community ID: {classroom.communityId}
              </p>
              <p className="text-gray-500 text-sm mt-4">
                Created at: {classroom.createdAt}
              </p>
              <p className="text-gray-500 text-sm mt-4">
                Updated at: {classroom.updatedAt}
              </p>
              <p className="text-gray-500 text-sm mt-4">
                Progress: {classroom.progress}
              </p>
              <p className="text-gray-500 text-sm mt-4">
                {classroom.sections?.length || 0} section(s)
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Selected classroom details */}
      {selectedClassroom && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">{selectedClassroom.name}</h3>
              <p className="text-gray-600">{selectedClassroom.description}</p>
            </div>
            <button
              onClick={() => setShowSectionForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Section
            </button>
          </div>

          {/* Sections */}
          {selectedClassroom?.sections?.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No sections added yet.</p>
              <button
                onClick={() => setShowSectionForm(true)}
                className="mt-4 text-blue-500 underline"
              >
                Add your first section
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {selectedClassroom?.sections?.map((section) => (
                <div
                  key={section.id}
                  className={`border rounded-lg p-4 ${
                    selectedSection?.id === section.id
                      ? 'border-green-500 bg-green-50'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">{section.name}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSection(section)
                          setShowLessonForm(true)
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm flex items-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Content
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-red-500 hover:bg-red-100 p-1 rounded"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm italic">
                    {section.description}
                  </p>
                  <p className="text-gray-500 text-sm italic">
                    ID: {section.id}
                  </p>
                  <p className="text-gray-500 text-sm italic">
                    Classroom ID: {section.classroomId}
                  </p>
                  <p className="text-gray-500 text-sm italic">
                    Created at: {section.createdAt}
                  </p>
                  <p className="text-gray-500 text-sm italic">
                    Updated at: {section.updatedAt}
                  </p>

                  {/* Content items */}
                  {section.lessons.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">
                      No content items yet
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {section.lessons.map((lesson) => (
                        <li
                          key={lesson.id}
                          className="flex justify-between items-center p-2 bg-white rounded border"
                        >
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">{lesson.name}</span>
                              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {lesson.notes}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mt-1">
                              ID: {lesson.id}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Material Type: {lesson.Materials.materialType}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              File URL: {lesson.Materials.fileUrl}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Created at: {lesson.createdAt}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Updated at: {lesson.updatedAt}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Section ID: {lesson.sectionId}
                            </p>
                            
                            {lesson.Materials.materialType ===
                              MaterialType.DOC && (
                              <p className="text-sm text-gray-600 mt-1">
                                {lesson.notes?.substring(0, 50)}
                                {(lesson.notes?.length || 0) > 50 ? '...' : ''}
                              </p>
                            )}
                            {lesson.Materials.materialType !==
                              MaterialType.DOC && (
                              <a
                                href={lesson.Materials.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline mt-1 block"
                              >
                                View resource
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteLesson(section.id, lesson.id)
                            }
                            className="text-red-500 hover:bg-red-100 p-1 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Classroom Form Modal */}
      {showClassroomForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Classroom</h3>
              <button
                onClick={() => setShowClassroomForm(false)}
                className="text-gray-500 hover:bg-gray-100 p-1 rounded"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <CreateClassroomForm
              handleNewClassroom={handleNewCreateClassroom}
              setShowClassroomForm={setShowClassroomForm}
              communityId={parseInt(communityId)}
            />
          </div>
        </div>
      )}

      {/* Section Form Modal */}
      {showSectionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Section</h3>
              <button
                onClick={() => setShowSectionForm(false)}
                className="text-gray-500 hover:bg-gray-100 p-1 rounded"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <CreateSectionForm
              handleNewSection={handleNewCreateSection}
              setShowSectionForm={setShowSectionForm}
              classroomId={selectedClassroom?.id || 0}
            />
          </div>
        </div>
      )}

      {/* Content Form Modal */}
      {showLessonForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Lesson</h3>
              <button
                onClick={() => setShowLessonForm(false)}
                className="text-gray-500 hover:bg-gray-100 p-1 rounded"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <CreateLessonForm
              handleNewLesson={handleNewCreateLesson}
              setShowLessonForm={setShowLessonForm}
              sectionId={selectedSection?.id || 0}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ClassroomManagement
