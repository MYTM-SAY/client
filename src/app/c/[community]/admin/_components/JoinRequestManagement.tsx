'use client'

import { useState, useEffect } from 'react'
import { 
  getCommunityJoinRequests, 
  updateJoinRequestStatus, 
  type JoinRequest 
} from '@/app/actions/community'
import { CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/hooks/use-toast'

interface JoinRequestManagementProps {
  communityId: string
}

export default function JoinRequestManagement({ communityId }: JoinRequestManagementProps) {
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchJoinRequests()
  }, [communityId])

  const fetchJoinRequests = async () => {
    try {
      setLoading(true)
      const response = await getCommunityJoinRequests(communityId)
      if (response.success) {
        setJoinRequests(response.data || [])
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch join requests",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch join requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      setActionLoading(requestId)
      const response = await updateJoinRequestStatus(requestId, status)
      
      if (response.success) {
        setJoinRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, status, updatedAt: new Date().toISOString() }
              : req
          )
        )
        
        toast({
          title: "Success",
          description: `Join request ${status.toLowerCase()} successfully`,
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: response.message || `Failed to ${status.toLowerCase()} join request`,
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: `Failed to ${status.toLowerCase()} join request`,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const pendingRequests = joinRequests.filter(req => req.status === 'PENDING')
  const processedRequests = joinRequests.filter(req => req.status !== 'PENDING')

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Join Request Management</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Join Request Management</h2>
        <Badge variant="outline" className="text-sm">
          {pendingRequests.length} pending requests
        </Badge>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Pending Requests</h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={request.User?.profileImgURL} 
                          alt={request.User?.fullname || 'User'} 
                        />
                        <AvatarFallback>
                          {request.User?.fullname?.charAt(0) || <User className="h-6 w-6" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">
                            {request.User?.fullname || 'Unknown User'}
                          </h4>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1">{request.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          @{request.User?.username || 'unknown'} • {request.User?.email}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Requested on {formatDate(request.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                        disabled={actionLoading === request.id}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                        disabled={actionLoading === request.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Decisions</h3>
          <div className="space-y-3">
            {processedRequests.slice(0, 5).map((request) => (
              <Card key={request.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={request.User?.profileImgURL} 
                          alt={request.User?.fullname || 'User'} 
                        />
                        <AvatarFallback>
                          {request.User?.fullname?.charAt(0) || <User className="h-5 w-5" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {request.User?.fullname || 'Unknown User'}
                          </h4>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1">{request.status}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          Processed on {formatDate(request.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {joinRequests.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Join Requests</h3>
            <p className="text-gray-600">
              No one has requested to join this community yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 