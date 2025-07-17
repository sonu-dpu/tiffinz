"use client";
import { RegisterFormInput, registerUserSchema } from "@/zod/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import LoaderButton from "../ui/loader-button";
import { Input } from "../ui/input";
import { registerUser } from "@/helpers/client/user.auth";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRole } from "@/constants/enum";
import { toast } from "sonner";



function RegisterForm() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerUserSchema),
  });
  const [errorResponse, setErrorResponse] = useState<string>("");
  const [isLoading, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter()
  //console.log("errors", errors);
  const registrationType = searchParams.get("type");
  const onSubmit = async (data: RegisterFormInput) => {
    if (registrationType === "admin" && !data.adminSecret) {
      setError("adminSecret", {
        message: "Admin secret is required for admin registration",
      });
      return;
    }
    if (data.adminSecret?.trim()) {
      setValue("role", UserRole.admin);
    }
    startTransition(async () => {
      setErrorResponse("");
      const response = await registerUser(data);
      if (!response.success) {
        setErrorResponse(response.message);
        return;
      }

      if (response.success) {
        reset();
        toast.success("Registered Successfully", {description:"Login with your credentials"})
        router.push("/login")
      }
    });
  };
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        {/* <CardDescription></CardDescription> */}
        {/* <CardAction>Card Action</CardAction> */}
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {errorResponse && (
            <span className="text-red-600 text-sm">{errorResponse}</span>
          )}
          <Input
            label="Username"
            type="text"
            {...register("username")}
            placeholder="Username"
            errorMessage={errors.username?.message}
          />

          <Input
            label="Full Name"
            type="text"
            {...register("fullName")}
            placeholder="First Last"
            errorMessage={errors.fullName?.message}
          />

          <Input
            label="Phone"
            type="tel"
            {...register("phone")}
            placeholder="Phone Number"
            errorMessage={errors.phone?.message}
          />

          <Input
            label="Password"
            type="password"
            {...register("password")}
            placeholder="Password"
            errorMessage={errors.password?.message}
          />
          <Input
            label="Confirm Password"
            type="Password"
            placeholder="confirm your password"
            {...register("confirmPassword")}
            errorMessage={errors.confirmPassword?.message}
          />
          {registrationType?.trim() === "admin" && (
            <Input
              type="password"
              label="Secret Token"
              {...register("adminSecret", { required: true })}
              placeholder="***"
              onChange={(e) => setValue("adminSecret", e.target.value)}
              errorMessage={errors.adminSecret?.message}
            />
          )}
          <LoaderButton isLoading={isLoading} fallbackText="Registering...">
            Register
          </LoaderButton>
        </form>
      </CardContent>
    </Card>
  );
}

export default RegisterForm;
