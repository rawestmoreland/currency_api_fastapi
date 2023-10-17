'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TextField } from '@/components/Fields'
import { Button } from '@/components/ui/button'
import { useForm, Controller } from 'react-hook-form'
import { isEmpty } from 'lodash'
import { absolutePaths, paths } from '@/constants/paths'

export default function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const onSubmit = async data => {
    setError()
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: absolutePaths.dashboard,
    }).then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          setError('Incorrect email or password.')
        }
      } else router.push(paths.dashboard)
    })
  }

  return (
    <>
      {error && <div className="text-destructive">{error}</div>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-y-8"
      >
        <Controller
          name="email"
          control={control}
          rules={{ required: { value: true, message: 'Email is required' } }}
          render={({ field: { name, onChange, onBlur } }) => (
            <TextField
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="email"
              label="Email address"
              type="email"
              error={errors?.email}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: { value: true, message: 'Password is required' } }}
          render={({ field: { name, onChange, onBlur } }) => (
            <TextField
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="current-password"
              label="Password"
              type="password"
              error={errors?.password}
            />
          )}
        />
        <div>
          <Button
            className="w-full rounded-full bg-blue-600"
            disabled={!isEmpty(errors)}
            type="submit"
          >
            <span>
              Sign in <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
      </form>
    </>
  )
}
