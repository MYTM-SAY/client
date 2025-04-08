import { ReviewSortOption } from './CourseReviews'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ReviewFiltersProps {
  sortOption: ReviewSortOption
  onSortChange: (option: ReviewSortOption) => void
  totalResults: number
}

export const ReviewFilters = ({
  sortOption,
  onSortChange,
  totalResults,
}: ReviewFiltersProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="p-muted">{totalResults} reviews</span>
      <Select
        value={sortOption}
        onValueChange={(value) => onSortChange(value as ReviewSortOption)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="most_recent">Most Recent</SelectItem>
          <SelectItem value="highest_rated">Highest Rated</SelectItem>
          <SelectItem value="lowest_rated">Lowest Rated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
