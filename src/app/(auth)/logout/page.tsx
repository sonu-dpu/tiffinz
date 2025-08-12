"use client"

import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { logout } from '@/store/authSlice'
import { logoutUser } from '@/helpers/client/user.auth'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import Loader from '@/components/ui/Loader'

const LogoutPage = () => {
  const dispatch = useAppDispatch()

  const { data: logoutSuccess, isFetched } = useQuery({
    queryKey: ['logoutUser'],
    queryFn: logoutUser,
    refetchOnWindowFocus: false,
    retry: false,
  })

  useEffect(() => {
    if (isFetched) {
      dispatch(logout())

      if (logoutSuccess) {
        toast.success('Logout successful')
        redirect("/login")
      } else {
        toast.error('Logout failed')
      }
    }
  }, [isFetched, logoutSuccess, dispatch])

  return <Loader />
}

export default LogoutPage
