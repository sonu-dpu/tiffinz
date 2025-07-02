"use client"
import axios from "axios"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect } from "react";
import { IUser } from "@/models/user.model";
import { useSessionExists } from "@/hooks/useSessionExists";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setUsers } from "@/store/usersSlice";
import { UserTable } from "@/components/dashboard/users/UserTable";
import { handleError } from "@/lib/handleError";
async function getData() :Promise<IUser[] | []> {

  try {
    const res = await axios.get("/api/admin/users/", {headers:{Accept: "application/json"}});
    if(res.status !== 200) {
      throw new Error("Failed to fetch data");
    }
    const data = res.data.data.users;
    console.log('data', data)
    return data;
  } catch (error) {
    handleError(error, "users");
    return []
  }
}

export default function DemoPage() {
const isSessionExists = useSessionExists();
const {users} = useAppSelector((state)=>state.users);
const dispatch = useAppDispatch();
  useEffect(()=>{
    const fetchUsers = async ()=>{
      if(!isSessionExists) {
        return;
      }
        const data = await getData();
        console.log('users', JSON.stringify(data))
        dispatch(setUsers(data));
    } 
    if(!users || users.length === 0) {
      console.log('fetching users')
      fetchUsers();
    }
    
  },[isSessionExists, dispatch, users])

  if(!users){
    return <div className="container mx-auto py-10">Loading...</div>
  }
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={users} />
      <UserTable users={users} onVerify={(users)=>console.log('users', users)} />
    </div>
  )
}