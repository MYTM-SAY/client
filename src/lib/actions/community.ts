
const baseURL = process.env.BACKEND_BASE_URL || 'http://localhost:5000/api/v1'


export async function getJoinedCommunities(id: string) {
    const res = await fetch(`${baseURL}/communities/${id}/join-requests`, {
        cache: 'no-store',
        credentials: 'include',
    })
    const data = await res.json()
    console.log(data)
}

