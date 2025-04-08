import { Review } from './CourseReviews'
import { ReviewCard } from './ReviewCard'

interface ReviewsListProps {
  reviews: Review[]
  onHelpfulToggle: (reviewId: string) => void
}

export const ReviewsList = ({ reviews, onHelpfulToggle }: ReviewsListProps) => {
  if (reviews.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="p-muted">No reviews match your criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onHelpfulToggle={onHelpfulToggle}
        />
      ))}
    </div>
  )
}
