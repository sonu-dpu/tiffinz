"use client";
import { RegisterFormInput, registerUserSchema } from "@/zod/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LoaderButton from "../ui/loader-button";
import { Input } from "../ui/input";
import { registerUser } from "@/helpers/client/user.auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRole } from "@/constants/enum";
import { toast } from "sonner";
import Link from "next/link";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerUserSchema),
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  const registrationType = searchParams.get("type");
  const onSubmit = async (data: RegisterFormInput) => {
    if (registrationType === "admin") {
      if (!data.adminSecret) {
        setError("adminSecret", {
          message: "Admin secret is required for admin registration",
        });
        return;
      }
      if (data.adminSecret?.trim()) {
        data.role = UserRole.admin;
      }
    }
    const { user, error } = await registerUser(data);
    if (error) {
      toast.error("Registration Failed", {
        description: error.message,
      });
      setError("root", { message: error.message });
      return;
    }
    if (user) {
      reset();
      toast.success("Registered Successfully", {
        description: "Login with your credentials",
      });
      router.push("/login");
    }
  };
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {errors.root?.message && (
            <span className="text-red-600 text-sm">{errors.root.message}</span>
          )}

          <Input
            label="Full Name"
            type="text"
            {...register("fullName")}
            placeholder="First Last"
            errorMessage={errors.fullName?.message}
          />
          <Input
            label="Username"
            type="text"
            {...register("username")}
            placeholder="Username"
            errorMessage={errors.username?.message}
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
            placeholder="Confirm your password"
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
          <LoaderButton isLoading={isSubmitting} fallbackText="Registering...">
            Register
          </LoaderButton>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-center w-full text-muted-foreground">
          Already registered?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default RegisterForm;
