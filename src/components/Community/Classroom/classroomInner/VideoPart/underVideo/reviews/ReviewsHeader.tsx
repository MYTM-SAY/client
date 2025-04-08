import { Star } from 'lucide-react'

interface ReviewsHeaderProps {
  totalReviews: number
  averageRating: number
}

export const ReviewsHeader = ({
  totalReviews,
  averageRating,
}: ReviewsHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <h2 className="text-2xl font-bold">Reviews</h2>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="font-bold ml-1">{averageRating.toFixed(1)}</span>
        </div>
        <span className="p-muted">({totalReviews} reviews)</span>
      </div>
    </div>
  )
}
