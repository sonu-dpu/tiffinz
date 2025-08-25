"use client";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { UserRole } from "@/constants/enum";
import useCurrentUser from "@/hooks/useCurrentUser";

function DashboardPage() {
  const {user, userRole} = useCurrentUser();
  if(!user){
    return null;
  }
  if(userRole===UserRole.user){
    return <UserDashboard user={user}/>
  }else if(userRole===UserRole.admin){
    return <AdminDashboard user={user}/>
  }
}

export default DashboardPage;
