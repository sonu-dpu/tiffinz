"use client"

import Profile from '@/components/dashboard/profile/Profile'
import { useAppSelector } from '@/hooks/reduxHooks'
import React from 'react'

function ProfilePage() {
const user = useAppSelector((state)=>state.auth.user);
  if(!user) return null
  return (
    <div>
        <Profile user={user} />
    </div>
  )
}

export default ProfilePage
