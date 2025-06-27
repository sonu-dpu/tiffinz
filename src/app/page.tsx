"use client";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/helpers/client/user.auth";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { login } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { Suspense, useEffect} from "react";

export default function Home() {
  const userData = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const fetchUser = async () => {
    if (userData) return;
    const { user, error } = await getCurrentUser();
    if (error) {
      router.push("/login");
    }
    if (user) {
      console.log("user", user);
      dispatch(login(user));
    }
  };
  useEffect(() => {
    fetchUser()
  }, []);
  // if(loading){
  //   return <div>Loading...</div>
  // }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* {!userData ? (
          "No User found"
      ) : (
        <div>
          <Input value={userData.fullName} label="User full name" readOnly />
          <Input value={userData.phone} label="User full name" readOnly />
          <Input value={userData.email} label="User full name" readOnly />
        </div>
      )}

      <Link href="/login">Login</Link>
      <Link href="/profile">Profile</Link> */}
      <Suspense fallback={<div>Loading.. et5ertu67yi78oi98il  .</div>}>
        {userData && (
          <div>
            <Input value={userData.fullName} label="User full name" readOnly />
            <Input value={userData.phone} label="User full name" readOnly />
            <Input value={userData.email} label="User full name" readOnly />
          </div>
        )}
      </Suspense>
    </div>
  );
}
