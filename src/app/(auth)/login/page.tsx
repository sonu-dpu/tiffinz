import LoginForm from "@/components/auth/LoginForm";
import React from "react";

function LoginPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full border min-h-[100vh] items-center">
      <div>
        <LoginForm />
      </div>
      <div className="w-full h-full hidden md:block"></div>
    </div>
  );
}

export default LoginPage;
