"use client"
import { useAppSelector } from "./reduxHooks";

export default function useCurrentUser(){
    const {user, isLoggedIn} =  useAppSelector((state)=>state.auth);
    const role = user?.role;
    return {user, isLoggedIn, userRole:role}
}