'use client'

import { ReactNode } from 'react'
import ThemeProviderWrapper from './ThemeProvider'
import { SidebarProvider } from '@/components/ui/sidebar'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProviderWrapper>
      <SidebarProvider>
        {children}
        </SidebarProvider>
    </ThemeProviderWrapper>
  )
}
