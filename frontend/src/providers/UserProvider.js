'use client'

import { useContext, createContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const UserContext = createContext()

UserProvider.propTypes = {
  children: PropTypes.node,
}

export default function UserProvider({ children }) {
  const { data: session, status } = useSession()

  const pathname = usePathname()

  const token = session?.user?.jwt

  const {
    data: userData,
    isError,
    isLoading,
    isInitialLoading,
    isFetching,
    isFetched,
    error,
  } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      return response.data
    },
    enabled: status === 'authenticated' && !!token,
  })

  if (
    (!isInitialLoading &&
      !isFetching &&
      !isFetched &&
      status === 'authenticated') ||
    error?.response?.status === 404
  ) {
    if (pathname !== '/login') signOut()
  }

  const providerValue = useMemo(
    () => ({
      userData,
      isError,
      isLoading,
    }),
    [userData, isError, isLoading],
  )

  // You can extend this to provide more user-related functions and states.
  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
