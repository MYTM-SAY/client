import { Star, ThumbsUp } from 'lucide-react'
import { Review } from './CourseReviews'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface ReviewCardProps {
  review: Review
  onHelpfulToggle: (reviewId: string) => void
}

export const ReviewCard = ({ review, onHelpfulToggle }: ReviewCardProps) => {
  // Format date to display "Month Day, Year"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="pb-6 border-b">
      <div className="flex items-start space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.userAvatar} alt={review.userName} />
          <AvatarFallback>{review.userInitials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div>
            <h4 className="font-medium">{review.userName}</h4>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="p-sm-muted">{formatDate(review.date)}</span>
            </div>
          </div>

          <div>
            <h5 className="font-medium">{review.title}</h5>
            <p className="p-muted mt-1">{review.content}</p>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              className={`flex items-center gap-1 hover:bg-background ${
                review.isHelpful ? 'text-base text-blue-600' : 'p-muted'
              }`}
              onClick={() => onHelpfulToggle(review.id)}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>
                Helpful {review.helpfulCount > 0 && `(${review.helpfulCount})`}
              </span>
            </Button>
          </div>

          {review.response && (
            <div className="mt-4 bg-background p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Response from Instructor</span>
                <span className="p-sm-muted">
                  {formatDate(review.response.date)}
                </span>
              </div>
              <p className="p-muted">{review.response.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
