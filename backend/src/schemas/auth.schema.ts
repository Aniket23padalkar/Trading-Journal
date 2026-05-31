import { z } from "zod";

export const registerUserSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  password: z.string().min(6),
});

export type registerData = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
});

export type loginData = z.infer<typeof loginUserSchema>;
