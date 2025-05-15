import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex-col-center min-h-[calc(100vh-4rem)] gap-6">
      <div className="flex-col-center gap-2">
        <Icons.logo className="h-16 w-16 text-destructive" />
        <h1 className="h1 text-center">500</h1>
        <p className="p-muted text-center max-w-md">
          Oops! Something went wrong on our end. Please try again later.
        </p>
        {error.digest && (
          <p className="p-sm-muted text-center">Error ID: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-4">
        <Button onClick={reset} variant="outline">
          Try Again
        </Button>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
