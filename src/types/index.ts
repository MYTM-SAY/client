import { ReactNode } from 'react'

export type ServerResponse<T> =
  | { success: true; data: T }
  | { success: false; message: string; statusCode?: number }
const Role = ['OWNER', 'MEMBER', 'MODERATOR'] as const
export type Role = typeof Role

export interface Tag {
  id: number
  name: string
}
export interface ServerError {
  success: false
  message: string
}

export interface Post {
  id: number
  title: string
  content: string
  voteCounter: number
  attachments: unknown[]
  forumId: number
  authorId: number
  createdAt: string
  updatedAt: string
}
export interface Question {
  id: number
  classroomId: number
  createdAt: string
  updatedAt: string
  questionHeader: string
  options: string[]
  answer: string[]
  type: 'SINGLE' | 'MULTI' | 'TRUE_FALSE'
}

export interface QuizQuestion {
  id: number
  quizId: number
  questionId: number
  points: number
  Question: Question
}

export interface Quiz {
  id: number
  name: string
  duration: number
  startDate: string
  endDate: string
  classroomId: number
  active: boolean
  createdAt: string
  updatedAt: string
  QuizQuestions?: QuizQuestion[]
  questionCount?: number
  finalScore?: number
  isAttempted?: boolean
}

export interface QuizSubmission {
  quizId: number
  answers: QuizAnswer[]
}

export interface QuizAnswer {
  questionId: number
  selectedAnswers: string[]
}

export type ApiResponse<T> = {
  data: ApiResponseData<T>
}

export type ApiResponseData<T> = {
  success: boolean
  data: T
  message?: string
}

export type ApiResponseError = {
  response: {
    data: {
      success: false
      message: string
    }
  }
}

export type UserFromToken = {
  id: number
  email: string
  username: string
  fullname: string
  iat: number
  exp: number
  profilePictureURL: string
}

export interface SidebarProps {
  handleOnClick: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>,
  ) => void
  active: string
}

export interface ContributionGraphProps {
  contributions: number[]
}

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export interface CommunityCardProps {
  status: string
}

export interface ShareButtonProps {
  url?: string
  title?: string
}
export interface GroupProps {
  num: number
}

export interface Community {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  coverImgURL: string
  logoImgURL: string
  ownerId: string
  isPublic: boolean
  classrooms: Classroom[]
}

export interface Classroom {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  coverImg: string
  communityId: string
  progress: number
  sections: Section[]
}

export interface Section {
  id: number
  name: string
  description: string
  classroomId: number
  lessons: Lesson[]
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: number
  name: string
  notes: string[] | string // Support both array (new) and string (existing) formats
  sectionId: number
  createdAt: string
  updatedAt: string
  duration?: number
  Materials: Material
  Material?: Material // Optional for backward compatibility when creating new lessons
}

export interface Material {
  id: number
  materialType: MaterialType
  fileUrl: string
  createdAt: string
  updatedAt: string
  duration?: number
}

export enum MaterialType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  IMG = 'IMG',
  DOC = 'DOC',
  FILE = 'FILE',
}
export interface Event {
  id: string
  title: string
  date: string // ISO string format
  time?: string
  description?: string
  color?: string
}
