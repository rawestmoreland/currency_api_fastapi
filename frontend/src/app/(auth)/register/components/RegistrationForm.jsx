'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/Fields'
import { useForm, Controller } from 'react-hook-form'
import { isEmpty } from 'lodash'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { SuccessDialog } from './SuccessDialog'

export default function RegistrationForm() {
  const [error, setError] = useState()
  const [apiKey, setApiKey] = useState()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const onSubmit = async data => {
    setError()
    // Create the user
    await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/register`, {
        email: data.email,
        password: data.password,
        last_name: data.last_name,
        first_name: data.first_name,
      })
      .then(async res => {
        // Sign the user in
        await signIn('credentials', {
          redirect: false,
          email: res.data.email,
          password: data.password,
        }).then(() => {
          setIsDialogOpen(true)
          setApiKey(res.data.keys[0].original_api_key)
        })
      })
      .catch(e => {
        const errorMessage = e.response?.data?.detail
          ? e.response?.data?.detail
          : 'There was an error. Please Try again.'
        setError(errorMessage)
      })
  }

  return (
    <>
      {error && <div className="text-destructive">{error}</div>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
      >
        <Controller
          name="first_name"
          control={control}
          rules={{
            required: { value: true, message: 'First name is required' },
          }}
          render={({ field: { name, onChange, onBlur } }) => (
            <TextField
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              label="First name"
              type="text"
              error={errors?.first_name}
            />
          )}
        />
        <Controller
          name="last_name"
          control={control}
          rules={{
            required: { value: true, message: 'Last name is required' },
          }}
          render={({ field: { name, onChange, onBlur } }) => (
            <TextField
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              label="Last name"
              type="text"
              error={errors?.last_name}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: { value: true, message: 'Email address is required' },
          }}
          render={({ field: { name, onChange, onBlur } }) => (
            <TextField
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              label="Email"
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
              label="Password"
              type="password"
              error={errors?.password}
            />
          )}
        />
        {/* <SelectField
          className="col-span-full"
          label="How did you hear about us?"
          name="referral_source"
        >
          <option>AltaVista search</option>
          <option>Super Bowl commercial</option>
          <option>Our route 34 city bus ad</option>
          <option>The “Never Use This” podcast</option>
        </SelectField> */}
        <div className="col-span-full">
          <Button
            disabled={!isEmpty(errors)}
            className="w-full rounded-full bg-blue-600"
            type="submit"
          >
            <span>
              Sign up <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
      </form>
      <SuccessDialog
        apiKey={apiKey}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}
