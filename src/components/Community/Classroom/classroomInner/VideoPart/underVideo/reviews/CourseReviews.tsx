import { useState } from 'react'
import { ReviewsList } from './ReviewsList'
import { ReviewStats } from './ReviewStats'
import { ReviewSearchBar } from './ReviewSearchBar'
import { ReviewFilters } from './ReviewFilters'
import { ReviewsHeader } from './ReviewsHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { reviewsData } from './reviews-data'

export type Rating = 1 | 2 | 3 | 4 | 5
export type ReviewSortOption = 'most_recent' | 'highest_rated' | 'lowest_rated'

export interface Review {
  id: string
  userId: string
  userName: string
  userInitials: string
  userAvatar?: string
  rating: Rating
  date: string
  title: string
  content: string
  helpfulCount: number
  isHelpful?: boolean
  response?: {
    instructorName: string
    date: string
    content: string
  }
}

export const CourseReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(reviewsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState<Rating | null>(null)
  const [sortOption, setSortOption] = useState<ReviewSortOption>('most_recent')

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleRatingFilter = (rating: Rating | null) => {
    setRatingFilter(rating)
  }

  const handleSortChange = (option: ReviewSortOption) => {
    setSortOption(option)
  }

  const handleHelpfulToggle = (reviewId: string) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            helpfulCount: review.isHelpful
              ? review.helpfulCount - 1
              : review.helpfulCount + 1,
            isHelpful: !review.isHelpful,
          }
        }
        return review
      }),
    )
  }

  // Filter reviews based on search term and rating filter
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      searchTerm === '' ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRating =
      ratingFilter === null || review.rating === ratingFilter

    return matchesSearch && matchesRating
  })

  // Sort reviews based on selected option
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortOption) {
      case 'highest_rated':
        return b.rating - a.rating
      case 'lowest_rated':
        return a.rating - b.rating
      case 'most_recent':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  // Calculate review stats
  const totalReviews = reviews.length
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
  const ratingCounts = reviews.reduce(
    (counts, review) => {
      counts[review.rating - 1]++
      return counts
    },
    [0, 0, 0, 0, 0],
  )

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <ReviewsHeader
        totalReviews={totalReviews}
        averageRating={averageRating}
      />
      <div className="grid grid-cols-1  gap-6">
        <div className="">
          <ReviewStats
            averageRating={averageRating}
            ratingCounts={ratingCounts}
            totalReviews={totalReviews}
            onRatingFilter={handleRatingFilter}
            activeRating={ratingFilter}
          />
        </div>
        <div className=" space-y-6">
          <div className="flex flex-col space-y-4">
            <ReviewSearchBar onSearch={handleSearch} />
            <ReviewFilters
              sortOption={sortOption}
              onSortChange={handleSortChange}
              totalResults={sortedReviews.length}
            />
          </div>
          <ReviewsList
            reviews={sortedReviews}
            onHelpfulToggle={handleHelpfulToggle}
          />
        </div>
      </div>
    </div>
  )
}
