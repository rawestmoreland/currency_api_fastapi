import Link from 'next/link'

import { SlimLayout } from '@/components/SlimLayout'
import SignInButton from '@/components/SignInButton'
import SignInForm from './components/SignInForm'

export const metadata = {
  title: 'Sign In',
}

export default function Login() {
  return (
    <SlimLayout>
      <div className="flex">
        <Link
          aria-label="Home"
          href="/"
          className="flex justify-center gap-2 text-xl font-semibold"
        >
          <span className="text-2xl">&#128177;</span> The Currency API
        </Link>
      </div>
      <h2 className="mt-8 text-lg font-semibold text-gray-700">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Don’t have an account?{' '}
        <Link
          className="font-medium text-blue-600 hover:underline"
          href="/register"
        >
          Sign up
        </Link>{' '}
        for a free tier.
      </p>
      <SignInForm />
      <SignInButton className="w-full gap-4" provider="google" />
    </SlimLayout>
  )
}
