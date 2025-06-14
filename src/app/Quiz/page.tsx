'use client'
import { useState } from 'react'
import QuizTable from './components/QuizTable'
import StatsCard from './components/StatsCard'
import QuizForm from './components/QuizForm'
import QuizDetails from './components/QuizDetails'
import { quizzes, newQuiz, updatedQuiz } from './data/quizData'

export default function QuizDashboard() {
  const [quizzesData, setQuizzesData] = useState(quizzes)
  const [currentQuiz, setCurrentQuiz] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'view'>(
    'list',
  )
  const [deletingQuiz, setDeletingQuiz] = useState<number | null>(null)

  const handleCreateQuiz = () => {
    setCurrentQuiz(newQuiz)
    setViewMode('create')
  }

  const handleEditQuiz = (quiz: any) => {
    setCurrentQuiz(quiz)
    setViewMode('edit')
  }

  const handleViewQuiz = (quiz: any) => {
    setCurrentQuiz(quiz)
    setViewMode('view')
  }

  const handleDeleteQuiz = (id: number) => {
    setDeletingQuiz(id)

    // Simulate confirmation dialog
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzesData(quizzesData.filter((quiz) => quiz.id !== id))
    }

    setDeletingQuiz(null)
  }

  const handleFormSubmit = (quizData: any) => {
    if (viewMode === 'create') {
      // Simulate creating a new quiz
      const newQuizWithId = {
        ...quizData,
        id: Math.max(...quizzesData.map((q) => q.id)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questionCount: quizData.quizQuestions.length,
        QuizQuestions: quizData.quizQuestions.map((q: any, idx: number) => ({
          id: idx + 1,
          quizId: Math.max(...quizzesData.map((q) => q.id)) + 1,
          questionId: q.questionId,
          points: q.points,
          Question: {
            id: idx + 1,
            questionHeader: `Question ${idx + 1}`,
            options: ['Option 1', 'Option 2', 'Option 3'],
            answer: 'Option 1',
            classroomId: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        })),
      }

      setQuizzesData([...quizzesData, newQuizWithId])
    } else if (viewMode === 'edit') {
      // Simulate updating a quiz
      const updatedQuizzes = quizzesData.map((quiz) =>
        quiz.id === currentQuiz.id
          ? { ...quizData, updatedAt: new Date().toISOString() }
          : quiz,
      )
      setQuizzesData(updatedQuizzes)
    }

    setViewMode('list')
  }

  const handleCancel = () => {
    setViewMode('list')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
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
            <StatsCard quizzes={quizzesData} />
            <QuizTable
              quizzes={quizzesData}
              onEdit={handleEditQuiz}
              onView={handleViewQuiz}
              onDelete={handleDeleteQuiz}
            />
          </>
        )}

        {viewMode === 'create' && (
          <QuizForm
            quiz={currentQuiz}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        )}

        {viewMode === 'edit' && (
          <QuizForm
            quiz={currentQuiz}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        )}

        {viewMode === 'view' && (
          <QuizDetails quiz={currentQuiz} onClose={handleCancel} />
        )}
      </div>
    </div>
  )
}
