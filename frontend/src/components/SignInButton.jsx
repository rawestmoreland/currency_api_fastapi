'use client'

import PropTypes from 'prop-types'
import googleLogo from '@/images/loginProviders/google.png'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { Button } from './Button'

SignInButton.propTypes = {
  children: PropTypes.node,
  provider: PropTypes.string,
  register: PropTypes.bool,
}

export default function SignInButton({
  children,
  provider,
  register,
  ...props
}) {
  const providers = {
    google: {
      text: `${register ? 'Sign up' : 'Sign in'} with Google`,
      icon: googleLogo.src,
    },
  }

  return (
    <Button onClick={() => signIn(provider)} {...props}>
      <Image
        alt={`${provider} icon`}
        height={24}
        src={providers[provider].icon}
        width={24}
      />
      <span>{providers[provider].text}</span>
    </Button>
  )
}
