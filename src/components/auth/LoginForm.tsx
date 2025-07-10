"use client";
import React, { useEffect, useState, useTransition } from "react";
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
import { EyeClosed, LucideEye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSessionExists } from "@/hooks/useSessionExists";
import { toast } from "sonner";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginWithPhoneSchema) });
  const [isLoggingIn, startLoggingIn] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isSessionExists = useSessionExists();
  useEffect(() => {
    console.log("user", user);
    if (isLoggedIn && user) {
      toast.success("User logged in successfully");
      router.push("/dashboard");
    }
  }, [user, isLoggedIn, router, isSessionExists]);
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
        toast.error("Login failed: " + error.message);
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
          <div className="w-full flex items-end">
            <Input
              className="border w-full"
              errorMessage={errors.password?.message}
              label="Enter your password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <Button
              className=""
              variant={"outline"}
              type="button"
              onClick={toggleShowPassword}
            >
              {showPassword ? <EyeClosed /> :<LucideEye />}
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
            fallbackText="logging in..."
          >
            Login
          </LoaderButton>
        </form>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
