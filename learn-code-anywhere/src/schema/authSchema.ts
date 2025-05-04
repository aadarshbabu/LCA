import { z } from "zod";
export const UserRegistrationSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name is must be at least 2 characters long")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z]+$/, "First name can only contain letters"),
    lastName: z
      .string()
      .min(2, "Last name is must be at least 2 characters long")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z]+$/, "Last name can only contain letters")
      .optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
