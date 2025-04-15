import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Post from '@/components/Post/Post'
import { CreatePost } from './CreatePost'
import { getUser } from '@/lib/actions/auth'

interface Props {
  name: string
}

export default async function Forum({ name }: Props) {
  const posts = Array.from({ length: 40 }, (_, i) => <Post key={i} />)
  const user = await getUser()

  console.log(user)

  return (
    <div className="">
      <div className="col-span-2">
        <div className="flex-center gap-1 px-4 py-2 rounded-lg border-[2px] border-foreground w-full mb-5">
          <Avatar>
            <AvatarImage src="/pp-fallback.svg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <CreatePost />
        </div>
        <div className="space-y-3">{posts}</div>
      </div>
    </div>
  )
}
