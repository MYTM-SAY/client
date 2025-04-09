const baseURL = process.env.BACKEND_BASE_URL || 'http://localhost:3000'

export const Community = {
    async getAll() {
        const res = await fetch(`${baseURL}/communities`, {
            cache: 'no-store',
        })
        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }
        return res.json()
    }
}