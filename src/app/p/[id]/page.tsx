import { getPost } from '@/app/actions/post'

interface Props {
  params: {
    id: string
  }
}

export default async function Page({ params: { id } }: Props) {
  const postReq = await getPost(id)
  if (!postReq.success) {
    return 'An error has occurred'
  }

  const post = postReq.data

  return (
    <main>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </main>
  )
}
