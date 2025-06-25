import RegisterForm from "@/components/auth/RegisterForm";
import React from "react";

function RegisterPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full border min-h-[100vh] items-center">
      <div>
        <RegisterForm />
      </div>
      <div className="w-full h-full hidden md:block"></div>
    </div>
  );
}

export default RegisterPage;
