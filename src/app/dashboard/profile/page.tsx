"use client";
import UserProfile from '@/components/dashboard/profile/UserProfile';
import { useAppSelector } from '@/hooks/reduxHooks';

function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <>
        <UserProfile user={user} />
    </>
  )
}

export default ProfilePage
