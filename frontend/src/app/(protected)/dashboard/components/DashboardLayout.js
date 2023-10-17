'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'
import { ChartBarIcon, KeyIcon } from '@heroicons/react/24/outline'
import DashboardNav from './DashboardNav/Desktop/DashboardNav'
import MobileDashboardNav from './DashboardNav/Mobile/MobileDashboardNav'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Usage', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Api Keys', href: '/keys', icon: KeyIcon },
]

DashboardLayout.propTypes = {
  children: PropTypes.node,
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const enhancedNav = navigation.map(item => ({
    ...item,
    current: item.href === pathname,
  }))

  return (
    <div>
      <MobileDashboardNav
        navigation={enhancedNav}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      <DashboardNav navigation={enhancedNav} />
      <main className="py-10 text-gray-700 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
