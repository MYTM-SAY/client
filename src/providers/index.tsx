'use client'

import { ReactNode } from 'react'
import ThemeProviderWrapper from './ThemeProvider'

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
}
