import Link from 'next/link'

import { SlimLayout } from '@/components/SlimLayout'
import RegistrationForm from './components/RegistrationForm'
import SignInButton from '@/components/SignInButton'

export const metadata = {
  title: 'Sign Up',
}

export default function Register() {
  return (
    <SlimLayout>
      <div className="flex">
        <Link
          aria-label="Home"
          href="/"
          className="flex w-full items-center gap-4 text-3xl font-semibold text-gray-700"
        >
          &#128177; The Currency API
        </Link>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        Get started for free
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Already registered?{' '}
        <Link
          className="font-medium text-blue-600 hover:underline"
          href="/login"
        >
          Sign in
        </Link>{' '}
        to your account.
      </p>
      <RegistrationForm />
      <SignInButton register className="w-full gap-4" provider="google" />
    </SlimLayout>
  )
}
