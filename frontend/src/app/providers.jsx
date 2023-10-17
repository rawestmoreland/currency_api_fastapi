'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import UserProvider from '@/providers/UserProvider'
import UserKeysProvider from '@/providers/UserKeysProvider'

Providers.propTypes = {
  children: PropTypes.node,
}

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <UserKeysProvider>{children}</UserKeysProvider>
      </UserProvider>
    </QueryClientProvider>
  )
}
