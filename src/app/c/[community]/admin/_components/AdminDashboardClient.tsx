'use client'
import { useState, useEffect } from 'react'
import ClassroomManagement from './ClassroomManagement'
import JoinRequestManagement from './JoinRequestManagement'
import QuizForm from '@/app/Quiz/components/QuizForm'
import {
  Users,
  BookOpen,
  Settings,
  Globe,
  Lock,
  UserX,
  UserCheck,
  Trash2,
  X,
  Loader2,
  FileQuestion,
  Plus,
  Pencil,
  Trash,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  changeCommunityVisibility,
  deleteMember,
} from '@/app/actions/community'
import { toast } from '@/hooks/use-toast'
import { Classroom } from '@/types'
import { Quiz } from '@/types'
import useQuiz from '@/hooks/useQuiz'
import useQuestion from '@/hooks/useQuestion'
import QuestionForm from '../_components/QuestionForm'
interface Member {
  id: number
  fullname: string
  email: string
  profilePictureURL: string | null
  role: string
}

type ActionType =
  | 'mute'
  | 'delete'
  | 'ban'
  | 'role'
  | 'transfer'
  | 'archive'
  | null

interface AdminDashboardClientProps {
  communityId: string
  initialClassrooms: Classroom[]
  initialMembers: Member[]
  initialVisibility: 'public' | 'private'
}

interface Question {
  id: number
  questionHeader: string
  options: string[]
  answer: string[]
  classroomId: number
  type: 'SINGLE' | 'MULTI' | 'TRUE_FALSE'
}

export default function AdminDashboardClient({
  communityId,
  initialClassrooms,
  initialMembers,
  initialVisibility,
}: AdminDashboardClientProps) {
  const [classrooms] = useState<Classroom[]>(initialClassrooms)
  const [showQuizForm, setShowQuizForm] = useState(false)
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [loading] = useState(false)
  const [selectedAction, setSelectedAction] = useState<ActionType>(null)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [communityVisibility, setCommunityVisibility] = useState<
    'public' | 'private'
  >(initialVisibility)
  const [visibilityLoading, setVisibilityLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Question states
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(
    null,
  )

  // Quiz hook
  const {
    quizzes,
    isLoading: quizzesLoading,
    error: quizzesError,
    createQuiz,
    editQuiz,
    deleteQuiz,
    getQuizzesByCommunity,
  } = useQuiz()

  // Question hook
  const {
    questions,
    isLoading: questionsLoading,
    error: questionsError,
    createQuestion,
    editQuestion,
    deleteQuestion,
    fetchQuestionsByClassroom,
  } = useQuestion()

  useEffect(() => {
    getQuizzesByCommunity(communityId)
  }, [])

  useEffect(() => {
    if (selectedClassroom) {
      fetchQuestionsByClassroom(selectedClassroom)
    }
  }, [selectedClassroom])

  const handleDeleteMember = async (userId: number) => {
    setDeletingId(userId)
    setError(null)

    const result = await deleteMember(communityId, userId)

    if (!result || result.success !== false) {
      setMembers((prev) => prev.filter((member) => member.id !== userId))
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      })
    } else {
      setError(result.message || 'Failed to delete member')
      toast({
        title: 'Error',
        description: result.message || 'Failed to delete member',
        variant: 'destructive',
      })
    }

    setDeletingId(null)
  }

  const handleAction = (action: ActionType) => {
    if (action === 'delete') {
      setShowMembersModal(true)
    } else {
      setSelectedAction(action)
      setShowActionModal(true)
    }
  }

  const handleConfirm = () => {
    setSelectedAction(null)
    setShowActionModal(false)
    setEmail('')
    toast({
      title: 'Action completed',
      description: `${selectedAction} action has been processed`,
    })
  }

  const handleVisibilityChange = async (
    newVisibility: 'public' | 'private',
  ) => {
    setVisibilityLoading(true)
    setError(null)

    try {
      const isPublic = newVisibility === 'public'
      const result = await changeCommunityVisibility(communityId, isPublic)

      if (result.success) {
        setCommunityVisibility(newVisibility)
        toast({
          title: 'Success',
          description: `Community visibility changed to ${newVisibility}`,
        })
      } else {
        setError(result.message || 'Failed to change community visibility')
        toast({
          title: 'Error',
          description:
            result.message || 'Failed to change community visibility',
          variant: 'destructive',
        })
      }
    } catch (error) {
      const errorMessage =
        'An error occurred while changing community visibility'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setVisibilityLoading(false)
    }
  }

  const handleCreateQuiz = () => {
    setShowQuizForm(true)
  }

  const handleEditQuiz = (quiz: Quiz) => {
    setShowQuizForm(true)
  }

  const handleSubmitQuiz = async (formData: Partial<Quiz>) => {
    try {
      if (formData.id) {
        await editQuiz(formData.id, {
          name: formData.name,
          duration: formData.duration,
          startDate: formData.startDate,
          endDate: formData.endDate,
          classroomId: formData.classroomId,
          active: formData.active,
          quizQuestions: formData.quizQuestions,
        })
        toast({
          title: 'Success',
          description: 'Quiz updated successfully',
        })
      } else {
        await createQuiz({
          name: formData.name!,
          duration: formData.duration!,
          startDate: formData.startDate!,
          endDate: formData.endDate!,
          active: formData.active ?? true,
          classroomId: formData.classroomId!,
          quizQuestions: formData.quizQuestions || [],
        })
        toast({
          title: 'Success',
          description: 'Quiz created successfully',
        })
      }
      setShowQuizForm(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save quiz',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteQuiz = async (id: number) => {
    try {
      await deleteQuiz(id)
      toast({
        title: 'Success',
        description: 'Quiz deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete quiz',
        variant: 'destructive',
      })
    }
  }

  // Question operations
  const handleCreateQuestion = () => {
    setCurrentQuestion(null)
    setShowQuestionForm(true)
  }

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion(question)
    setShowQuestionForm(true)
  }

  const handleDeleteQuestion = async (id: number) => {
    try {
      await deleteQuestion(id)
      toast({
        title: 'Success',
        description: 'Question deleted successfully',
      })
      if (selectedClassroom) {
        fetchQuestionsByClassroom(selectedClassroom)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete question',
        variant: 'destructive',
      })
    }
  }

  const handleSubmitQuestion = async (data: any) => {
    try {
      if (currentQuestion) {
        await editQuestion(currentQuestion.id, data)
        toast({
          title: 'Success',
          description: 'Question updated successfully',
        })
      } else {
        await createQuestion(data)
        toast({
          title: 'Success',
          description: 'Question created successfully',
        })
      }
      setShowQuestionForm(false)
      if (selectedClassroom) {
        fetchQuestionsByClassroom(selectedClassroom)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save question',
        variant: 'destructive',
      })
    }
  }

  const stats = [
    {
      title: 'Total Classrooms',
      value: classrooms.length,
      icon: BookOpen,
      description: 'Active learning spaces',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    },
    {
      title: 'Total Members',
      value: members.length,
      icon: Users,
      description: 'Community members',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Action Modal */}
      {showActionModal && selectedAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity animate-in fade-in">
          <div className="bg-background border rounded-lg shadow-xl w-full max-w-md transform transition-all duration-200 ease-out animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {selectedAction === 'role'
                  ? 'Change Member Role'
                  : 'Community Action'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowActionModal(false)}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              {selectedAction === 'role' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Member Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter member's email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">New Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowActionModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Confirm</Button>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal for Deletion */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity animate-in fade-in">
          <div className="bg-background border rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto transform transition-all duration-200 ease-out animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-background z-10">
              <h2 className="text-xl font-bold">Remove Members</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMembersModal(false)}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  <p>{error}</p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No members found in this community</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={
                                member.profilePictureURL || '/pp-fallback.svg'
                              }
                              alt={member.fullname}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-muted">
                              {member.fullname.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.fullname}</h3>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {member.email}
                            </p>
                            <Badge
                              variant={
                                member.role === 'OWNER'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="mt-1"
                            >
                              {member.role}
                            </Badge>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          disabled={
                            deletingId === member.id || member.role === 'OWNER'
                          }
                          className={
                            member.role === 'OWNER'
                              ? 'text-muted-foreground cursor-not-allowed'
                              : ' hover:text-destructive'
                          }
                        >
                          {deletingId === member.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-destructive"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowMembersModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your community settings and content
              </p>
            </div>
            <Badge
              variant="secondary"
              className="flex items-center gap-2 px-3 py-1 self-start sm:self-auto"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border bg-card hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="bg-muted grid w-full grid-cols-6 lg:w-fit">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Members</span>
            </TabsTrigger>
            <TabsTrigger value="classrooms" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Classrooms</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Quizzes</span>
            </TabsTrigger>
            <TabsTrigger
              value="questionbank"
              className="flex items-center gap-2"
            >
              <FileQuestion className="h-4 w-4" />
              <span>Question Bank</span>
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    Member Management
                    <CardDescription className="mt-1">
                      Review and manage community membership requests and member
                      access
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <JoinRequestManagement communityId={communityId} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classrooms Tab */}
          <TabsContent value="classrooms" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                    <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    Classroom Management
                    <CardDescription className="mt-1">
                      Create and manage learning spaces for your community
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ClassroomManagement
                  communityId={communityId}
                  classrooms={classrooms}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Community Visibility Settings */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                    {communityVisibility === 'public' ? (
                      <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    )}
                  </div>
                  <div>
                    Community Visibility
                    <CardDescription className="mt-1">
                      This community is currently{' '}
                      <Badge
                        variant={
                          communityVisibility === 'public'
                            ? 'default'
                            : 'secondary'
                        }
                        className="ml-1"
                      >
                        {communityVisibility}
                      </Badge>
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {communityVisibility === 'public'
                        ? 'Public Community'
                        : 'Private Community'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {communityVisibility === 'public'
                        ? 'Anyone can discover and join this community'
                        : 'Only invited members can join this community'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleVisibilityChange(
                        communityVisibility === 'public' ? 'private' : 'public',
                      )
                    }
                    disabled={visibilityLoading}
                    className="flex items-center gap-2"
                  >
                    {visibilityLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        Change to{' '}
                        {communityVisibility === 'public'
                          ? 'Private'
                          : 'Public'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Member Management Actions */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                    <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    Member Actions
                    <CardDescription className="mt-1">
                      Manage member permissions and community access
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Remove Member Card */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                          <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Remove member</h4>
                          <p className="text-sm text-muted-foreground">
                            Delete a user from the community
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleAction('delete')}
                        className="mt-2"
                      >
                        Remove Member
                      </Button>
                    </div>
                  </div>

                  {/* Change Role Card */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Change member role</h4>
                          <p className="text-sm text-muted-foreground">
                            Modify permissions and access levels
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleAction('role')}
                        className="mt-2"
                      >
                        Change Role
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                      <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      Quizzes
                      <CardDescription className="mt-1">
                        Manage quizzes for your community
                      </CardDescription>
                    </div>
                  </div>
                  <Button onClick={handleCreateQuiz}>Create Quiz</Button>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {showQuizForm && (
                  <div className="border p-4 rounded-lg bg-muted">
                    <QuizForm
                      quiz={{
                        id: '',
                        name: '',
                        duration: 30,
                        startDate: new Date().toISOString().slice(0, 16),
                        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .slice(0, 16),
                        classroomId: '',
                        active: true,
                        quizQuestions: [],
                      }}
                      onSubmit={handleSubmitQuiz}
                      onCancel={() => setShowQuizForm(false)}
                    />
                  </div>
                )}

                {quizzesLoading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}

                {quizzesError && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-lg">
                    {quizzesError}
                  </div>
                )}

                {!quizzesLoading && !quizzesError && quizzes.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No quizzes available.
                  </p>
                )}

                {!quizzesLoading && !quizzesError && quizzes.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {quizzes.map((quiz) => (
                      <Card key={quiz.id} className="border hover:shadow-sm">
                        <CardHeader className="flex flex-row justify-between items-center">
                          <CardTitle className="text-lg font-semibold">
                            {quiz.name}
                          </CardTitle>
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditQuiz(quiz)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteQuiz(quiz.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm space-y-1">
                          <Badge
                            variant={quiz.active ? 'default' : 'secondary'}
                            className="mt-2"
                          >
                            {quiz.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Question Bank Tab */}
          <TabsContent value="questionbank" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                      <FileQuestion className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      Question Bank
                      <CardDescription className="mt-1">
                        Manage questions for your community
                      </CardDescription>
                    </div>
                  </div>
                  <Button onClick={handleCreateQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Classroom Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="classroom">Select Classroom</Label>
                    <Select
                      value={selectedClassroom?.toString() || ''}
                      onValueChange={(value) =>
                        setSelectedClassroom(Number(value))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a classroom" />
                      </SelectTrigger>
                      <SelectContent>
                        {initialClassrooms.map((classroom) => (
                          <SelectItem
                            key={classroom.id}
                            value={classroom.id.toString()}
                          >
                            {classroom.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Question Form */}
                {showQuestionForm && (
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <h3 className="text-lg font-semibold mb-4">
                      {currentQuestion
                        ? 'Edit Question'
                        : 'Create New Question'}
                    </h3>
                    <QuestionForm
                      classrooms={initialClassrooms}
                      question={currentQuestion}
                      onSubmit={handleSubmitQuestion}
                      onCancel={() => setShowQuestionForm(false)}
                    />
                  </div>
                )}

                {/* Questions List */}
                <div className="space-y-4">
                  {questionsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : questionsError ? (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-lg">
                      {questionsError}
                    </div>
                  ) : !selectedClassroom ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium">Select a classroom</p>
                      <p className="text-muted-foreground mt-2">
                        Choose a classroom to view its questions
                      </p>
                    </div>
                  ) : questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium">No questions yet</p>
                      <p className="text-muted-foreground mt-2">
                        Add your first question to get started
                      </p>
                      <Button onClick={handleCreateQuestion} className="mt-4">
                        Create Question
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {questions.map((question) => (
                          <Card key={question.id} className="hover:shadow-sm">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-medium">
                                  {question.questionHeader}
                                </CardTitle>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditQuestion(question)}
                                    className="h-8 w-8"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteQuestion(question.id)
                                    }
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <Trash className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">
                                  {question.type.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline">
                                  {question.options.length} options
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">
                                  Options:
                                </h4>
                                <ul className="text-sm text-muted-foreground grid grid-cols-2 gap-1">
                                  {question.options.map((option, idx) => (
                                    <li
                                      key={idx}
                                      className={`flex items-center ${
                                        question.answer.includes(option)
                                          ? 'text-green-600 dark:text-green-400 font-medium'
                                          : ''
                                      }`}
                                    >
                                      <span className="mr-2">•</span>
                                      <span className="truncate">{option}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
