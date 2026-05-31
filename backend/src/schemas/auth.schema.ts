import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export const registerUserSchema = z.object({
  first_name: z.string().trim().min(3, "First name is required"),
  last_name: z.string().trim().min(3, "Last name is required"),
  email: emailSchema,
  password: z.string().min(6),
});

export type registerData = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(6),
});

export type loginData = z.infer<typeof loginUserSchema>;
