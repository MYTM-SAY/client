'use client'
import { MouseEvent } from 'react'

interface PaginationProps {
  active: number
  postsPerPage: number
  totalPosts: number
  paginate: (pageNumber: number, e: MouseEvent<HTMLAnchorElement>) => void
}

export const Pagination = ({
  active,
  postsPerPage,
  totalPosts,
  paginate,
}: PaginationProps) => {
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++)
    pageNumbers.push(i)

  return (
    <nav>
      <ul className="flex space-x-1">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`${
              number == active ? 'bg-red-900' : ''
            } rounded-full w-8 h-8 flex items-center justify-center`}
          >
            <a href="#" onClick={(e) => paginate(number, e)}>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
