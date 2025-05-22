
import { z } from "zod/v4";

interface ILoginCredentials{
 password:string;
 email?:string;
 phone?:string;
 username?:string;
}

const passwordSchema = z
  .string()
  .trim()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password is too long");

const loginWithUsernameSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  password: passwordSchema,
});

const loginWithEmailSchema = z.object({
  email: z.email("Invalid email"),
  password: passwordSchema,
});

const loginWithPhoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit"),
  password: passwordSchema,
});


export {loginWithEmailSchema, loginWithPhoneSchema, loginWithUsernameSchema}
export type {ILoginCredentials}