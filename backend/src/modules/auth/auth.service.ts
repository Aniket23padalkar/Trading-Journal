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
      issuer: config.jwtIssuer,
    },
  );
};

export const registerService = async (
  body: RegisterBodyData,
): Promise<RegisterUserResponse> => {
  const first_name = body.first_name.trim();
  const last_name = body.last_name.trim();
  const email = body.email.toLowerCase().trim();
  const password = body.password;

  const user = await getUserFromDB(email);

  if (user) {
    throw new AppError("Invalid email or password", 401);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
  } catch (err: any) {
    if (err.code === "23505") {
      throw new AppError("User already exists", 409);
    }
    throw err;
  }

  return { message: "User Created Successfully!" };
};

export const loginService = async (
  body: LoginBodyData,
): Promise<SafeUserWithToken> => {
  const email = body.email.toLowerCase().trim();
  const { password } = body;

  const user = await getUserFromDB(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
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
