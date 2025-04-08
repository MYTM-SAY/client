import { Star } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Rating } from './CourseReviews'

interface ReviewStatsProps {
  averageRating: number
  ratingCounts: number[]
  totalReviews: number
  onRatingFilter: (rating: Rating | null) => void
  activeRating: Rating | null
}

export const ReviewStats = ({
  averageRating,
  ratingCounts,
  totalReviews,
  onRatingFilter,
  activeRating,
}: ReviewStatsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center py-4 border rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
        </div>
        <p className="p-muted">Course Rating</p>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingCounts[rating - 1]
          const percentage = (count / totalReviews) * 100

          return (
            <button
              key={rating}
              onClick={() =>
                onRatingFilter(
                  activeRating === rating ? null : (rating as Rating),
                )
              }
              className={`flex items-center w-full p-1 rounded hover:bg-background  ${
                activeRating === rating ? 'bg-background' : ''
              }`}
            >
              <div className="flex items-center gap-1 w-12">
                <span>{rating}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 mx-2">
                <Progress value={percentage} className="h-4 border" />
              </div>
              <span className="p-sm-muted w-8 text-right">{count}</span>
            </button>
          )
        })}
      </div>

      {activeRating && (
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => onRatingFilter(null)}
        >
          Clear Filter
        </Button>
      )}
    </div>
  )
}
