import RegisterForm from "@/components/auth/RegisterForm";
import Loader from "@/components/ui/Loader";
import React, { Suspense } from "react";

function RegisterPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full border min-h-[100vh] items-center px-4">
      <div>
        <Suspense fallback={<Loader/>}>
        <RegisterForm />
        </Suspense>
      </div>
      <div className="w-full h-full hidden md:block"></div>
    </div>
  );
}

export default RegisterPage;
