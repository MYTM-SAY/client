'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import QuizTable from './components/QuizTable'
import StatsCard from './components/StatsCard'
import QuizForm from './components/QuizForm'
import QuizDetails from './components/QuizDetails'
import useQuiz from '@/hooks/useQuiz'
import useQuestion from '@/hooks/useQuestion'
import { Quiz } from '@/types'

interface QuizFormData {
  id?: string
  name: string
  duration: number
  startDate: string
  endDate: string
  classroomId: string
  active: boolean
  quizQuestions: Array<{
    questionId: number
    points: number
  }>
}

export default function QuizDashboard() {
  const searchParams = useSearchParams()
  const classroomId = searchParams.get('classroomId')
  const communityId = searchParams.get('communityId')
  
  const {
    quizzes,
    quiz: selectedQuiz,
    isLoading: quizLoading,
    error: quizError,
    createQuiz,
    editQuiz,
    deleteQuiz,
    getQuizzesByClassroom,
    getQuizzesByCommunity,
    getQuizById,
  } = useQuiz()

  const {
    questions,
    isLoading: questionsLoading,
    error: questionsError,
    fetchQuestionsByClassroom,
  } = useQuestion()

  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'view'>(
    'list',
  )
  const [deletingQuiz, setDeletingQuiz] = useState<number | null>(null)

  useEffect(() => {
    // Load quizzes based on context
    if (classroomId) {
      getQuizzesByClassroom(classroomId)
      fetchQuestionsByClassroom(parseInt(classroomId))
    } else if (communityId) {
      getQuizzesByCommunity(communityId)
    }
  }, [classroomId, communityId])

  const handleCreateQuiz = () => {
    setCurrentQuiz(null)
    setViewMode('create')
  }

  const handleEditQuiz = async (quiz: Quiz) => {
    await getQuizById(quiz.id)
    setCurrentQuiz(selectedQuiz || quiz)
    setViewMode('edit')
  }

  const handleViewQuiz = async (quiz: Quiz) => {
    await getQuizById(quiz.id)
    setCurrentQuiz(selectedQuiz || quiz)
    setViewMode('view')
  }

  const handleDeleteQuiz = async (id: number) => {
    setDeletingQuiz(id)

    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(id)
      } catch (error) {
        console.error('Failed to delete quiz:', error)
      }
    }

    setDeletingQuiz(null)
  }

  const handleFormSubmit = async (quizData: QuizFormData) => {
    try {
      if (viewMode === 'create') {
        await createQuiz({
          name: quizData.name,
          duration: quizData.duration,
          startDate: quizData.startDate,
          endDate: quizData.endDate,
          classroomId: parseInt(quizData.classroomId),
          active: quizData.active,
          quizQuestions: quizData.quizQuestions,
        })
      } else if (viewMode === 'edit' && currentQuiz) {
        await editQuiz(currentQuiz.id, {
          name: quizData.name,
          duration: quizData.duration,
          startDate: quizData.startDate,
          endDate: quizData.endDate,
          classroomId: parseInt(quizData.classroomId),
          active: quizData.active,
          quizQuestions: quizData.quizQuestions,
        })
      }
      setViewMode('list')
    } catch (error) {
      console.error('Failed to save quiz:', error)
    }
  }

  const handleCancel = () => {
    setViewMode('list')
    setCurrentQuiz(null)
  }

  // Show loading state
  if (quizLoading || questionsLoading) {
    return (
      <div className="min-h-screen bg-card border rounded-xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (quizError || questionsError) {
    return (
      <div className="min-h-screen bg-card border rounded-xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {quizError || questionsError}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-card border rounded-xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Quiz Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create, manage, and track all your quizzes in one place
            </p>
          </div>

          {viewMode === 'list' && (
            <button
              onClick={handleCreateQuiz}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create New Quiz
            </button>
          )}
        </div>

        {viewMode === 'list' && (
          <>
            <StatsCard quizzes={quizzes} />
            <QuizTable
              quizzes={quizzes}
              onEdit={handleEditQuiz}
              onView={handleViewQuiz}
              onDelete={handleDeleteQuiz}
              isDeleting={deletingQuiz}
            />
          </>
        )}

        {viewMode === 'create' && (
          <QuizForm
            quiz={{
              name: '',
              duration: 60,
              startDate: '',
              endDate: '',
              classroomId: classroomId || '',
              active: true,
              quizQuestions: [],
            }}
            questions={questions}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isLoading={quizLoading}
          />
        )}

        {viewMode === 'edit' && currentQuiz && (
          <QuizForm
            quiz={{
              id: currentQuiz.id.toString(),
              name: currentQuiz.name,
              duration: currentQuiz.duration,
              startDate: currentQuiz.startDate,
              endDate: currentQuiz.endDate,
              classroomId: currentQuiz.classroomId.toString(),
              active: currentQuiz.active,
              quizQuestions: [],
            }}
            questions={questions}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isLoading={quizLoading}
          />
        )}

        {viewMode === 'view' && currentQuiz && (
          <QuizDetails quiz={currentQuiz} onClose={handleCancel} />
        )}
      </div>
    </div>
  )
}
