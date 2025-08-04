"use client"

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from 'react'


function QueryProvider({ children }: { children: React.ReactNode }) {
    // Create a new QueryClient instance per component lifecycle (important in client components)
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default QueryProvider