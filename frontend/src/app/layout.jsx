import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'

import { getServerSession } from 'next-auth'
import SessionProvider from '@/providers/SessionProvider'

import '@/styles/tailwind.css'
import Providers from './providers'
import { authOptions } from './api/auth/[...nextauth]/route'

export const metadata = {
  title: {
    template: '%s - The Currency API',
    default: 'The Currency API - Simple. Affordable. Accurate.',
  },
  description:
    'No frills, no hidden fees—just precise and up-to-date currency exchange rates with frequent updates. Dive into a world of simplicity and accuracy with The Currency API.',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)
  return (
    <html
      className={clsx(
        'h-full scroll-smooth bg-gray-50 antialiased',
        inter.variable,
        lexend.variable,
      )}
      lang="en"
    >
      {/* eslint-disable-next-line react/jsx-boolean-value */}
      <body className="flex h-full flex-col" suppressHydrationWarning={true}>
        <SessionProvider session={session}>
          <Providers>{children}</Providers>
        </SessionProvider>
      </body>
    </html>
  )
}
