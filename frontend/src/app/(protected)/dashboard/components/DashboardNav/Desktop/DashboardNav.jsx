'use client'

import PropTypes from 'prop-types'
import Link from 'next/link'
import { classNames } from '@/utils/utils'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { UserCircle2Icon } from 'lucide-react'
import { useUser } from '@/providers/UserProvider'

DashboardNav.propTypes = {
  navigation: PropTypes.arrayOf(PropTypes.shape({})),
}

export default function DashboardNav({ navigation }) {
  const { session } = useSession()
  const { userData } = useUser()
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <div className="flex h-16 shrink-0 items-center">
          <Link href="/">
            <span className="text-lg font-bold">The Currency API</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul className="-mx-2 space-y-1">
                {navigation.map(item => (
                  <li key={item.name}>
                    <a
                      className={classNames(
                        item.current
                          ? 'bg-gray-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                      )}
                      href={item.href}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          item.current
                            ? 'text-indigo-600'
                            : 'text-gray-400 group-hover:text-indigo-600',
                          'h-6 w-6 shrink-0',
                        )}
                      />
                      {item.name}
                    </a>
                  </li>
                ))}
                <li>
                  <Button className="mt-8 bg-blue-600" onClick={signOut}>
                    Sign out
                  </Button>
                </li>
              </ul>
            </li>
            <li className="-mx-6 mt-auto">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                href="#"
              >
                {session?.user?.image || userData?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt="User avatar"
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src={`${session?.user?.image || userData?.image}`}
                  />
                ) : (
                  <UserCircle2Icon height={32} width={32} />
                )}

                <span className="sr-only">Your profile</span>
                <span aria-hidden="true">{`${userData?.first_name} ${userData?.last_name}`}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
