"use client";
import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full border min-h-[100vh] items-center">
      <div>
        <LoginForm />
      </div>
      <div className="w-full h-full hidden md:block"></div>
    </div>
  );
}
