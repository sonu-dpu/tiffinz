"use client";

import React, { useState, useTransition } from "react";
import LoaderButton from "../ui/loader-button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginWithPhoneSchema,
  UserLoginWithPhoneInput,
} from "@/zod/user.login.schema";
import { Button } from "../ui/button";
import { loginUserWithPhone } from "@/helpers/client/user.auth";
import { login } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useRouter } from "next/navigation";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginWithPhoneSchema) });
  const [isLoggingIn, startLoggingIn] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  if (isLoggedIn && user) {
    router.push("/");
    return null; // Prevent rendering the form if already logged in
  }
  const toggleShowPassword = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const onSubmit = async (data: UserLoginWithPhoneInput) => {
    setErrorResponse("");
    startLoggingIn(async () => {
      const { user, error } = await loginUserWithPhone({
        phone: data.phone,
        password: data.password,
      });
      if (error) {
        setErrorResponse(error.message);
        console.error("Login failed:", error);
        return;
      }
      console.log("Login successful:", user);
      dispatch(login(user));
    });
  };
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Login with Phone</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Enter Your Phone"
            placeholder="99999 77777"
            errorMessage={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            errorMessage={errors.password?.message}
            label="Enter your password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <div>
            <Button variant={"secondary"} onClick={toggleShowPassword}>
              {showPassword ? "Hide Password" : "Show Password"}
            </Button>
          </div>
          {errorResponse && (
            <p className="text-red-600 text-sm text-center pt-2">
              {errorResponse}
            </p>
          )}
          <LoaderButton
            className="w-full"
            isLoading={isLoggingIn}
            fallbackText="logging in"
          >
            Login
          </LoaderButton>
        </form>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
