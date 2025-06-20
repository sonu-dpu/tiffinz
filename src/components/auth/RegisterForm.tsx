"use client";
import { UserInput, userSchema } from "@/zod/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import LoaderButton from "../ui/loader-button";
import { Input } from "../ui/input";
import { registerUser } from "@/helpers/client/user.auth";
import { Card, CardContent } from "../ui/card";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
  });
  console.log("errors", errors);
  const onSubmit = async (data: UserInput) => {
    const response = await registerUser(data);
    if (response.success) {
      console.log("response", response);
    }
  };
  return (
    <Card className="w-full max-w-sm mx-auto">

      <CardContent>
        <form className="space-y-1" onSubmit={handleSubmit(onSubmit)}>
          <Input type="text" {...register("username")} placeholder="Username" />
          {errors.username && <span>{errors.username.message}</span>}

          <Input
            type="text"
            {...register("fullName")}
            placeholder="Full Name"
          />
          {errors.fullName && <span>{errors.fullName.message}</span>}

          <Input type="tel" {...register("phone")} placeholder="Phone Number" />
          {errors.phone && <span>{errors.phone.message}</span>}

          <Input type="email" {...register("email")} placeholder="Email" />
          {errors.email && <span>{errors.email.message}</span>}

          <Input
            type="password"
            {...register("password")}
            placeholder="Password"
          />
          {errors.password && <span>{errors.password.message}</span>}

          <LoaderButton isLoading={false} fallbackText="Logingin...">
            Login
          </LoaderButton>
        </form>
      </CardContent>
    </Card>
  );
}

export default RegisterForm;
