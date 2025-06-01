import React from 'react'
import { ContributionGraphProps } from '../../types/index'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Drops {
  value: string
  label: string
}
const years: Drops[] = [
  { value: '2020', label: '2020' },
  { value: '2021', label: '2021' },
  { value: '2022', label: '2022' },
  { value: '2023', label: '2023' },
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
]

const ContributionGraph = ({ contributions }: ContributionGraphProps) => {
  const colors: string[] = ['#ebedf0', '#8bb4f7', '#5a9cf7', '#3a85f5']

  const currentYear = new Date().getFullYear()
  const daysInYear = contributions.length

  const firstDayOfYear = new Date(Date.UTC(currentYear, 0, 1)).getUTCDay()

  const weeks: number[][] = []
  let currentWeek: number[] = []

  for (let i = 0; i < firstDayOfYear; i++) {
    currentWeek.push(0)
  }

  for (let day = 0; day < daysInYear; day++) {
    currentWeek.push(contributions[day])

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(0)
    }
    weeks.push(currentWeek)
  }

  const getMonthLabel = (weekIndex: number) => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    if (weekIndex === 0) return monthNames[0]

    const monthIndex = Math.floor((weekIndex / weeks.length) * 12)
    return monthNames[monthIndex]
  }

  return (
    <div className="mb-8">
      <div className="flex-between pb-4">
        <p className="h4 ">Activity</p>
        <Select>
          <SelectTrigger className="w-[180px] p-lg">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="custom-dropdown-content">
            {years.map(({ value, label }, idx) => (
              <SelectItem
                key={idx}
                className="custom-dropdown-item p-lg"
                value={value}
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto w-full">
        <div className="flex pl-6 pb-1">
          {weeks.map((_, weekIndex) => {
            if (weekIndex % 4 === 0) {
              return (
                <div
                  key={`month-${weekIndex}`}
                  className="text-xs text-gray-500 min-w-[14px]"
                  style={{ width: `${14 * 4}px` }}
                >
                  {getMonthLabel(weekIndex)}
                </div>
              )
            }
            return (
              <div key={`spacer-${weekIndex}`} className="min-w-[14px]"></div>
            )
          })}
        </div>

        <div className="flex">
          <div className="flex flex-col mr-1">
            {['Sun', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
              <div key={i} className="h-[14px] text-xs text-gray-500 mb-1">
                {day}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((contribution, dayIndex) => {
                  const dayOffset = weekIndex * 7 + dayIndex - firstDayOfYear
                  const date = new Date(Date.UTC(currentYear, 0, 1))
                  date.setUTCDate(date.getUTCDate() + dayOffset)

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      title={`${
                        date.toISOString().split('T')[0]
                      }: ${contribution} contribution${
                        contribution !== 1 ? 's' : ''
                      }`}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: colors[Math.min(contribution, 3)],
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mt-4 gap-1">
        <span className="text-xs text-gray-500 mr-2">Less</span>
        {colors.map((color, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">More</span>
      </div>
    </div>
  )
}

export default ContributionGraph
