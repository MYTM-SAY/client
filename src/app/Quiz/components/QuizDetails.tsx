import { Quiz } from '../data/quizData'

interface QuizDetailsProps {
  quiz: Quiz
  onClose: () => void
}

const QuizDetails: React.FC<QuizDetailsProps> = ({ quiz, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {quiz.name}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Quiz Information
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span
                className={`font-medium ${
                  quiz.active
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {quiz.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Grade:</span>
              <span className="font-medium">{quiz.grade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Duration:
              </span>
              <span className="font-medium">{quiz.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Classroom ID:
              </span>
              <span className="font-medium">{quiz.classroomId}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Timing
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Start Date:
              </span>
              <span className="font-medium">{formatDate(quiz.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                End Date:
              </span>
              <span className="font-medium">{formatDate(quiz.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Created:</span>
              <span className="font-medium">{formatDate(quiz.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Last Updated:
              </span>
              <span className="font-medium">{formatDate(quiz.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4">
          Questions ({quiz.questionCount})
        </h3>

        <div className="space-y-4">
          {quiz.QuizQuestions.map((quizQuestion, index) => (
            <div
              key={quizQuestion.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {quizQuestion.Question.questionHeader}
                </h4>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-2.5 py-0.5 rounded">
                  {quizQuestion.points} points
                </span>
              </div>

              <div className="space-y-2">
                {quizQuestion.Question.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      option === quizQuestion.Question.answer
                        ? 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {option}{' '}
                    {option === quizQuestion.Question.answer && (
                      <span className="text-green-600 dark:text-green-400 ml-2">
                        ✓ Correct Answer
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizDetails
