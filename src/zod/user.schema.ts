import { UserRole } from "@/constants/enum";
import { z } from "zod/v4";

export const userSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
  email: z.email("Inavlid email").optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  role: z.enum(UserRole).optional().default(UserRole.user),
  avatar: z.url("Avatar must be a valid URL").optional(),
  adminSecret: z.string().optional(),
});
//for client side validation, and password checking with confirm password field
export const registerUserSchema = userSchema
  .extend({ confirmPassword: z.string().optional() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const createUserByAdminSchema = userSchema.omit({ adminSecret: true}).extend({
  password: z.string().optional(),
  adminSecret: z.string().optional(),
});

export type CreateUserByAdminInput = z.infer<typeof createUserByAdminSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type RegisterFormInput = z.infer<typeof registerUserSchema>
