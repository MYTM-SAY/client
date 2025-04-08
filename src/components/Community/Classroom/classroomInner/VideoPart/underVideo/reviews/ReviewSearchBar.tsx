import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface ReviewSearchBarProps {
  onSearch: (term: string) => void
}

export const ReviewSearchBar = ({ onSearch }: ReviewSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 p-muted h-4 w-4" />
      <Input
        type="text"
        placeholder="Search reviews"
        className="pl-10 pr-4 py-8 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  )
}
