import {
  checkUserExists,
  createUser,
  getExistingUser,
} from "./authRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";
import type { BodyUserData } from "../../types/auth.types.js";
import { AppError } from "../../utils/AppError.js";

const generateToken = (user_id: number) => {
  return jwt.sign(
    {
      user_id,
    },
    config.jwtSecret,
    {
      expiresIn: "30d",
    },
  );
};

export const registerService = async (body: BodyUserData) => {
  const { firstName, lastName, email_id, password } = body;

  if (!firstName || !lastName || !email_id || !password) {
    throw new AppError("Please provide all the required fields", 400);
  }

  const userExist = await checkUserExists(email_id);

  if (userExist.rows.length > 0) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await createUser({
    firstName,
    lastName,
    email_id,
    hashedPassword,
  });

  return { message: "User Created Successfully!" };
};

export const loginService = async (body: BodyUserData) => {
  const { email_id, password } = body;

  if (!email_id || !password) {
    throw new AppError("Please provide all the required fields", 400);
  }

  const user = await getExistingUser(email_id);

  if (user.rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  const userData = user.rows[0];

  const isMatch = await bcrypt.compare(password, userData.password_hash);

  if (!isMatch) {
    throw new AppError("Wrong password", 400);
  }

  const token = generateToken(userData.user_id);

  return {
    token,
    user: {
      user_id: userData.user_id,
      firstname: userData.firstName,
      email_id: userData.email_id,
    },
  };
};
