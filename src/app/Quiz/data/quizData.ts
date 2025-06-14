// Define the Question interface
export interface Question {
  id: number
  questionHeader: string
  options: string[]
  answer: string
  classroomId: number
  createdAt: string
  updatedAt: string
}

// Define the QuizQuestion interface
export interface QuizQuestion {
  id: number
  quizId: number
  questionId: number
  points: number
  Question: Question
}

// Define the Quiz interface
export interface Quiz {
  id: number
  name: string
  duration: number
  startDate: string
  endDate: string
  grade: string
  classroomId: number
  active: boolean
  createdAt: string
  updatedAt: string
  questionCount: number
  QuizQuestions: QuizQuestion[]
}

// Sample quiz data
export const quizzes: Quiz[] = [
  {
    id: 1,
    name: 'Math Quiz 1',
    duration: 60,
    startDate: '2025-06-14T10:00:00.000Z',
    endDate: '2025-06-14T11:00:00.000Z',
    grade: 'A',
    classroomId: 1,
    active: true,
    createdAt: '2025-06-13T23:14:00.000Z',
    updatedAt: '2025-06-13T23:14:00.000Z',
    questionCount: 2,
    QuizQuestions: [
      {
        id: 1,
        quizId: 1,
        questionId: 1,
        points: 10,
        Question: {
          id: 1,
          questionHeader: 'What is 2+2?',
          options: ['3', '4', '5'],
          answer: '4',
          classroomId: 1,
          createdAt: '2025-06-13T23:00:00.000Z',
          updatedAt: '2025-06-13T23:00:00.000Z',
        },
      },
      {
        id: 2,
        quizId: 1,
        questionId: 2,
        points: 15,
        Question: {
          id: 2,
          questionHeader: 'What is the capital of France?',
          options: ['Paris', 'London', 'Berlin'],
          answer: 'Paris',
          classroomId: 1,
          createdAt: '2025-06-13T23:00:00.000Z',
          updatedAt: '2025-06-13T23:00:00.000Z',
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Science Quiz',
    duration: 45,
    startDate: '2023-10-05T14:00:00.000Z',
    endDate: '2023-10-05T15:00:00.000Z',
    grade: 'A',
    classroomId: 1,
    active: true,
    createdAt: '2025-06-12T01:09:02.493Z',
    updatedAt: '2025-06-12T01:09:02.493Z',
    questionCount: 3,
    QuizQuestions: [
      {
        id: 3,
        quizId: 2,
        questionId: 3,
        points: 12,
        Question: {
          id: 3,
          questionHeader: 'What is the chemical symbol for water?',
          options: ['H2O', 'CO2', 'O2'],
          answer: 'H2O',
          classroomId: 1,
          createdAt: '2025-06-13T23:00:00.000Z',
          updatedAt: '2025-06-13T23:00:00.000Z',
        },
      },
    ],
  },
  {
    id: 3,
    name: 'History Exam',
    duration: 90,
    startDate: '2025-07-01T09:00:00.000Z',
    endDate: '2025-07-01T10:30:00.000Z',
    grade: 'B',
    classroomId: 2,
    active: false,
    createdAt: '2025-06-10T08:30:00.000Z',
    updatedAt: '2025-06-12T11:45:00.000Z',
    questionCount: 5,
    QuizQuestions: [],
  },
]

// New quiz template
export const newQuiz = {
  name: '',
  duration: 30,
  startDate: '',
  endDate: '',
  grade: 'A',
  classroomId: '',
  active: true,
  quizQuestions: [{ questionId: '', points: 10 }],
}

// Updated quiz sample
export const updatedQuiz: Quiz = {
  id: 1,
  name: 'Updated Math Quiz',
  duration: 90,
  startDate: '2025-06-14T11:00:00.000Z',
  endDate: '2025-06-14T12:30:00.000Z',
  grade: 'B',
  classroomId: 1,
  active: false,
  createdAt: '2025-06-13T23:14:00.000Z',
  updatedAt: '2025-06-14T08:20:00.000Z',
  questionCount: 1,
  QuizQuestions: [
    {
      id: 3,
      quizId: 1,
      questionId: 3,
      points: 20,
      Question: {
        id: 3,
        questionHeader: 'What is the chemical symbol for water?',
        options: ['H2O', 'CO2', 'O2'],
        answer: 'H2O',
        classroomId: 1,
        createdAt: '2025-06-13T23:00:00.000Z',
        updatedAt: '2025-06-13T23:00:00.000Z',
      },
    },
  ],
}
