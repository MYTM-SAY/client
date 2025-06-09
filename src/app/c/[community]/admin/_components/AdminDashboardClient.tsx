'use client'
import { useState } from 'react'
import ClassroomManagement from './ClassroomManagement'
import JoinRequestManagement from './JoinRequestManagement'
import { Users, BookOpen, Settings, Globe, Lock, UserX, UserCheck, Trash2, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { deleteMember } from '@/app/actions/community'
import { toast } from '@/hooks/use-toast'
import { Classroom } from '@/types'

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
}

export default function AdminDashboardClient({
  communityId,
  initialClassrooms,
  initialMembers,
}: AdminDashboardClientProps) {
  const [classrooms] = useState<Classroom[]>(initialClassrooms)
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [loading] = useState(false)
  const [selectedAction, setSelectedAction] = useState<ActionType>(null)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [communityVisibility, setCommunityVisibility] = useState<'public' | 'private'>('public')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteMember = async (userId: number) => {
    setDeletingId(userId)
    setError(null)

    try {
      const result = await deleteMember(communityId, userId)

      if (result.success) {
        setMembers((prev) => prev.filter((member) => member.id !== userId))
        toast({
          title: "Success",
          description: "Member removed successfully",
        })
      } else {
        setError(result.message || 'Failed to delete member')
        toast({
          title: "Error",
          description: result.message || 'Failed to delete member',
          variant: "destructive",
        })
      }
    } catch (error) {
      setError('An error occurred while deleting the member')
      console.error('Error deleting member:', error)
      toast({
        title: "Error",
        description: 'An error occurred while deleting the member',
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
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
      title: "Action completed",
      description: `${selectedAction} action has been processed`,
    })
  }

  const handleVisibilityChange = (newVisibility: 'public' | 'private') => {
    setCommunityVisibility(newVisibility)
    toast({
      title: "Visibility updated",
      description: `Community is now ${newVisibility}`,
    })
  }

  const stats = [
    {
      title: "Total Classrooms",
      value: classrooms.length,
      icon: BookOpen,
      description: "Active learning spaces",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Members",
      value: members.length,
      icon: Users,
      description: "Community members",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Action Modal */}
      {showActionModal && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {selectedAction === 'role' ? 'Change Member Role' : 'Community Action'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowActionModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              {selectedAction === 'role' && (
                <>
                  <div>
                    <Label htmlFor="email">Member Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter member's email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">New Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger>
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
              <Button variant="outline" onClick={() => setShowActionModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal for Deletion */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">Remove Members</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMembersModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
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
                <div className="text-center py-8">
                  <p className="text-gray-500">No members found in this community</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={member.profilePictureURL || '/pp-fallback.svg'}
                              alt={member.fullname}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gray-200">
                              {member.fullname.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.fullname}</h3>
                            <p className="text-sm text-gray-600 truncate max-w-[200px]">
                              {member.email}
                            </p>
                            <Badge
                              variant={member.role === 'OWNER' ? 'default' : 'secondary'}
                              className="mt-1"
                            >
                              {member.role}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMember(member.id)}
                          disabled={deletingId === member.id || member.role === 'OWNER'}
                          className={member.role === 'OWNER' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}
                        >
                          {deletingId === member.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowMembersModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your community settings and content</p>
            </div>
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger value="classrooms" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Classrooms</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Member Management
                </CardTitle>
                <CardDescription>
                  Review and manage community membership requests and member access
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <JoinRequestManagement communityId={communityId} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classrooms Tab */}
          <TabsContent value="classrooms" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Classroom Management
                </CardTitle>
                <CardDescription>
                  Create and manage learning spaces for your community
                </CardDescription>
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
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                  {communityVisibility === 'public' ? (
                    <Globe className="h-5 w-5 text-green-600" />
                  ) : (
                    <Lock className="h-5 w-5 text-orange-600" />
                  )}
                  Community Visibility
                </CardTitle>
                <CardDescription>
                  This community is currently{' '}
                  <Badge variant={communityVisibility === 'public' ? 'default' : 'secondary'}>
                    {communityVisibility}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {communityVisibility === 'public' ? 'Public Community' : 'Private Community'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {communityVisibility === 'public' 
                        ? 'Anyone can discover and join this community' 
                        : 'Only invited members can join this community'
                      }
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleVisibilityChange(communityVisibility === 'public' ? 'private' : 'public')}
                    className="ml-4"
                  >
                    Change to {communityVisibility === 'public' ? 'Private' : 'Public'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Member Management Actions */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Member Management
                </CardTitle>
                <CardDescription>
                  Manage member permissions and community access
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Remove Member Card */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-red-50">
                          <UserX className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Remove member from the community</h4>
                          <p className="text-sm text-gray-600 mt-1">Delete a user from the community</p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleAction('delete')}
                      >
                        Remove Member
                      </Button>
                    </div>
                  </div>

                  {/* Change Role Card */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <UserCheck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Change member role</h4>
                          <p className="text-sm text-gray-600 mt-1">Modify permissions and access levels</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleAction('role')}
                      >
                        Change Role
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 