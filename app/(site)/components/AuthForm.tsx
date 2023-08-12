'use client'

import React, { useCallback, useState } from 'react'
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form'

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

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)

        if (variant === 'REGISTER') {
            // Axios Register
        } else if (variant === 'LOGIN') {
            // NextAuth Sign In
        }
    }

    const socialAction = (action: string) => {
        
    }

  return (
    <div>AuthForm</div>
  )
}

export default AuthForm