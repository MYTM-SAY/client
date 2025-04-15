import type { ServerResponse, Role } from '@/types'
import { axiosInstance } from './'

export async function getJoinedCommunities(id: string) {
  const res = await axiosInstance.get(`/users/${id}/communities`)

  interface Response {
    Role: Role
    Community: {
      id: string | number
      name: string
    }
  }

  return res.data as ServerResponse<Response[]>
}
