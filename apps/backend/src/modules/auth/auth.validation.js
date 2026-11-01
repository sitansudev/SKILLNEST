import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .max(72, "Password is too long")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[0-9]/, "Password must contain a number");

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email address").max(255)
    .transform((email) => email.toLowerCase()),
  password: passwordSchema
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address")
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Password is required")
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address")
    .transform((email) => email.toLowerCase())
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: passwordSchema
});
