'use client'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <ToggleGroup type="single" size="sm" onValueChange={setTheme} value={theme}>
      {theme === 'dark' ? (
        <ToggleGroupItem value="light" aria-label="Light">
          <SunIcon className="!w-6 !h-6" />
        </ToggleGroupItem>
      ) : (
        <ToggleGroupItem value="dark" aria-label="Dark">
          <MoonIcon className="!w-6 !h-6" />
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  )
}
