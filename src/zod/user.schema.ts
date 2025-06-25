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

// Type inference (optional but useful)
export type UserInput = z.infer<typeof userSchema>;
