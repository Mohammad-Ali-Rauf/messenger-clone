'use client'

import Button from '@/app/components/Button'
import Input from '@/app/components/inputs/Input'
import React, { useCallback, useState } from 'react'
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form'
import AuthSocialButton from './AuthSocialButton'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'

type Variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
	const [variant, setVariant] = useState<Variant>('LOGIN')
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const toggleVariant = useCallback(() => {
		if (variant === 'LOGIN') {
			setVariant('REGISTER')
		} else {
			setVariant('LOGIN')
		}
	}, [variant])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true)

		if (variant === 'REGISTER') {
			axios
				.post('/api/register', data)
				.then(() => toast.success('Account created successfully'))
				.catch(() => toast.error('Something went wrong'))
				.finally(() => setIsLoading(false))
		} else if (variant === 'LOGIN') {
			signIn('credentials', {
				...data,
				redirect: false,
			})
				.then((callback) => {
					if (callback?.error) {
						toast.error('Something went wrong')
					}

					if (callback?.ok && !callback?.error) {
						toast.success('Logged in')
					}
				})
				.finally(() => setIsLoading(false))
		}
		setIsLoading(false)
	}

	const socialAction = async (action: string) => {
		setIsLoading(true)

		signIn(action, {
			redirect: false,
		}).then((callback) => {
			if (callback?.error) {
				toast.error('Something went wrong')
				console.log(callback.error)
			}

			if (callback?.ok && !callback?.error) {
				toast.success('Logged in')
				console.log(callback)
			}
		}).finally(() => setIsLoading(false))
	}

	return (
		<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
			<div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
				<form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
					{variant === 'REGISTER' && (
						<Input
							disabled={isLoading}
							id='name'
							label='Name'
							placeholder='John Doe'
							register={register}
							errors={errors}
						/>
					)}
					<Input
						placeholder='john.doe@example.com'
						id='email'
						type='email'
						label='Email'
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
					<Input
						placeholder='●●●●●●'
						id='password'
						type='password'
						label='Password'
						register={register}
						disabled={isLoading}
						errors={errors}
					/>
					<div>
						<Button disabled={isLoading} fullWidth type='submit'>
							{variant === 'LOGIN' ? 'Sign In' : 'Sign Up'}
						</Button>
					</div>
				</form>

				<div className='mt-6'>
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-gray-300' />
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='px-2 bg-white text-gray-500'>
								Or continue with
							</span>
						</div>
					</div>

					<div className='mt-6 flex gap-2'>
						<AuthSocialButton
							icon={FaGithub}
							onClick={() => socialAction('github')}
						/>
					</div>
				</div>

				<div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
					<div>
						{variant === 'LOGIN'
							? 'New to Messenger?'
							: 'Already have an account?'}
					</div>
					<div onClick={toggleVariant} className='underline cursor-pointer'>
						{variant === 'LOGIN' ? 'Create one' : 'Sign In'}
					</div>
					{/* <button
						type='button'
						onClick={toggleVariant}
						className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
					>
						{variant === 'LOGIN' ? 'Create an account' : 'Sign in'}
					</button> */}
				</div>
			</div>
		</div>
	)
}

export default AuthForm
