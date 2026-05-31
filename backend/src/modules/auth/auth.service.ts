import { createUser } from "./auth.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";
import type {
  LoginBodyData,
  RegisterBodyData,
  RegisterUserResponse,
  SafeUserWithToken,
} from "../../types/auth.types.js";
import { AppError } from "../../utils/AppError.js";
import { getUserFromDB } from "./auth.repository.js";

const generateToken = (user_id: number) => {
  return jwt.sign(
    {
      user_id,
    },
    config.jwtSecret,
    {
      expiresIn: "30d",
      issuer: "tradelens",
    },
  );
};

export const registerService = async (
  body: RegisterBodyData,
): Promise<RegisterUserResponse> => {
  const { first_name, last_name, email, password } = body;

  const user = await getUserFromDB(email);

  if (user) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await createUser({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  return { message: "User Created Successfully!" };
};

export const loginService = async (
  body: LoginBodyData,
): Promise<SafeUserWithToken> => {
  const { email, password } = body;

  const user = await getUserFromDB(email.toLowerCase().trim());

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new AppError("Wrong password", 400);
  }

  const token = generateToken(user.user_id);

  return {
    token,
    user: {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    },
  };
};
