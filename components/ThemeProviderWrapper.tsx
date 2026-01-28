'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'

interface ThemeProviderWrapperProps {
  children: ReactNode
}

export default function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  return <ThemeProvider>{children}</ThemeProvider>
}
