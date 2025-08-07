"use client";
import LoginForm from "@/components/auth/LoginForm";
import Loader from "@/components/ui/Loader";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full border min-h-[100vh] items-center">
      <div>
        <Suspense fallback={<Loader />}>
          <LoginForm />
        </Suspense>
      </div>
      <div className="w-full h-full hidden md:block"></div>
    </div>
  );
}
