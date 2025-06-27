"use client";
import { UserInput, userSchema } from "@/zod/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import LoaderButton from "../ui/loader-button";
import { Input } from "../ui/input";
import { registerUser } from "@/helpers/client/user.auth";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
  });
  const [errorResponse, setErrorResponse] = useState<string>("");
  const [isLoading, startTransition] = useTransition();
  //console.log("errors", errors);
  const onSubmit = async (data: UserInput) => {
    startTransition(async () => {
      setErrorResponse("");
      const response = await registerUser(data);
      if (!response.success) {
        setErrorResponse(response.message);
        return;
      }
      if (response.success) {
        console.log("response", response);
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

          <LoaderButton isLoading={isLoading} fallbackText="Registering...">
            Register
          </LoaderButton>
        </form>
      </CardContent>
    </Card>
  );
}

export default RegisterForm;
