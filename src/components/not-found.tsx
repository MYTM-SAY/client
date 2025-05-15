import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

export default function NotFound() {
  return (
    <div className="flex-col-center min-h-[calc(100vh-4rem)] gap-6">
      <div className="flex-col-center gap-2">
        <Icons.logo className="h-16 w-16 text-primary" />
        <h1 className="h1 text-center">404</h1>
        <p className="p-muted text-center max-w-md">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          Return Home
        </Link>
      </Button>
    </div>
  )
} 