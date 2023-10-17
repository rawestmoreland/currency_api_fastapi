import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export async function checkUserExistsInBackend(userEmail) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/exists?access_token=${process.env.CURRENCY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      },
    )
    const userExists = await response.json()
    return userExists
  } catch (error) {
    console.log('Server error: ', error)
    throw new Error('Problem fetching user from backend')
  }
}

export async function createNewBackendUser({
  userEmail,
  imageUrl,
  provider = 'local',
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/create?access_token=${process.env.CURRENCY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          image: imageUrl,
          provider,
        }),
      },
    )

    if (response.ok) {
      return true
    }
    return false
  } catch (error) {
    console.error('Server error: ', error)
    throw new Error('Unable to create user')
  }
}

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
