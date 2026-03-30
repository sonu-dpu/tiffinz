import LoginForm from "@/components/auth/LoginForm";
import Loader from "@/components/ui/Loader";
import React, { Suspense } from "react";

function LoginPage() {
  return (
    <div className="grid gap-2 grid-cols-1 md:grid-cols-2 w-full max-h-dvh items-center px-4 md:px-2">
      <Suspense fallback={<Loader />}>
        <LoginForm />
      </Suspense>
      <div className="w-full h-full hidden md:block"></div>
    </div>
  );
}

export default LoginPage;
