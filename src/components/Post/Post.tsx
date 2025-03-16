import PostContent from './PostContent'
import PostActions from './PostActions'
import PostSettingsDropdown from './PostSettingsDropDown'
import Image from 'next/image'
import Link from 'next/link'

// TEMP:
const username = 'Hasasn Ezz'
const timestamp = '6h ago'
const commId = '343'
const community = 'Software Engineers'

export default function PostCard() {
  return (
    <div className="relative p-6 rounded-lg bg-card text-foreground shadow">
      <PostSettingsDropdown />

      {/* header */}
      <div className="flex gap-4 items-center">
        <Image
          src="/download (3).jpeg"
          className="rounded-full"
          alt="Profile Image"
          width={68}
          height={68}
        />
        <div>
          <Link href={'/u/' + username} className="h4">
            {username}
          </Link>
          <p className="p-muted">
            {timestamp} in{' '}
            <Link href={'/c/' + commId} className="font-bold underline">
              {community}
            </Link>
          </p>
        </div>
      </div>

      <PostContent
        title="Curious, how do you manage the full ML lifecycle?"
        content="Hi guys! I’ve been pondering a specific question/idea that I would like to pose as a discussion. It concerns the idea of more quickly going from idea to Hie as a discussion. It concerns the idea of more quickly going from idea to Hie as a discussion. It concerns the idea of more quickly going from idea to Hie as a discussion. It concerns the idea of more quickly going from idea to Hi"
      />

      <PostActions />
    </div>
  )
}
