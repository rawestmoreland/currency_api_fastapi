'use client'

import { useContext, createContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'

const UserKeysContext = createContext()

UserKeysProvider.propTypes = {
  children: PropTypes.node,
}

export default function UserKeysProvider({ children }) {
  const { data: session, status } = useSession()

  const token = session?.user?.jwt

  const {
    data: keysData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['userKeys'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api-key/user-keys`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      return response.data
    },
    enabled: status === 'authenticated' && !!token,
  })

  const providerValue = useMemo(
    () => ({
      keysData,
      isError,
      isLoading,
    }),
    [keysData, isError, isLoading],
  )

  // You can extend this to provide more user-related functions and states.
  return (
    <UserKeysContext.Provider value={providerValue}>
      {children}
    </UserKeysContext.Provider>
  )
}

export function useKeys() {
  const context = useContext(UserKeysContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
