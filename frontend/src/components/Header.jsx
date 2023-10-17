'use client'

import { Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { NavLink } from '@/components/NavLink'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'

MobileNavLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
}

function MobileNavLink({ href, children }) {
  return (
    <Popover.Button as={Link} className="block w-full p-2" href={href}>
      {children}
    </Popover.Button>
  )
}

MobileNavIcon.propTypes = {
  open: PropTypes.bool,
}

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeLinecap="round"
      strokeWidth={2}
    >
      <path
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0',
        )}
        d="M0 1H14M0 7H14M0 13H14"
      />
      <path
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0',
        )}
        d="M2 2L12 12M12 2L2 12"
      />
    </svg>
  )
}

function MobileNavigation() {
  const { data: session } = useSession()
  return (
    <Popover>
      <Popover.Button
        aria-label="Toggle Navigation"
        className="ui-not-focus-visible:outline-none relative z-10 flex h-8 w-8 items-center justify-center"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
            static
          >
            <MobileNavLink href="#pricing">Pricing</MobileNavLink>
            <hr className="m-2 border-slate-300/40" />
            {!session ? (
              <Button className="rounded-full bg-blue-600" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            ) : (
              <Button className="rounded-full bg-blue-600" onClick={signOut}>
                Sign out
              </Button>
            )}
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  )
}

Header.propTypes = {
  openMenu: PropTypes.bool,
}

export function Header({ openMenu }) {
  const { data: session } = useSession()

  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link
              aria-label="Home"
              href="/"
              className="flex items-center justify-center gap-2 text-sm font-semibold lg:text-xl"
            >
              <span className="text-lg lg:text-2xl">&#128177;</span> The
              Currency API
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <NavLink href="#pricing">Pricing</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              {session ? (
                <Button
                  color="blue"
                  onClick={() => signOut()}
                  variant="outline"
                >
                  Sign out
                </Button>
              ) : (
                <NavLink href="/login">Sign in</NavLink>
              )}
            </div>
            {!session ? (
              <Button className="rounded-full bg-blue-600" asChild>
                <Link href="/register">
                  <span>
                    Get your key <span className="hidden lg:inline">today</span>
                  </span>
                </Link>
              </Button>
            ) : (
              <Button className="bg-blue-600" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
            <div className="-mr-1 md:hidden">
              <MobileNavigation openMenu={openMenu} />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  )
}
