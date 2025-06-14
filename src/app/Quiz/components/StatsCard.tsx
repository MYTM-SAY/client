import { Quiz } from '../data/quizData'

interface StatsCardProps {
  quizzes: Quiz[]
}

const StatsCard: React.FC<StatsCardProps> = ({ quizzes }) => {
  const activeQuizzes = quizzes.filter((quiz) => quiz.active).length
  const totalQuestions = quizzes.reduce(
    (sum, quiz) => sum + quiz.questionCount,
    0,
  )
  const averageDuration =
    quizzes.reduce((sum, quiz) => sum + quiz.duration, 0) / quizzes.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Total Quizzes</p>
            <p className="text-3xl font-bold mt-1">{quizzes.length}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Active Quizzes</p>
            <p className="text-3xl font-bold mt-1">{activeQuizzes}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Total Questions</p>
            <p className="text-3xl font-bold mt-1">{totalQuestions}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
