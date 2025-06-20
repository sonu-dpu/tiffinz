"use client"


import React from 'react'
import LoaderButton from '../ui/loader-button'

function LoginForm() {
  return (
    <div>
   <LoaderButton isLoading={true} fallbackText='Loggin in'>Login</LoaderButton>
    </div>
  )
}

export default LoginForm
