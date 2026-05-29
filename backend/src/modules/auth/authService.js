import {
  checkUserExists,
  createUser,
  getExistingUser,
} from "../../repositories/authRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (id, firstname, email_id) => {
  return jwt.sign(
    {
      id,
      firstname,
      email_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
};

export const registerService = async (body) => {
  const { firstName, lastName, email_id, password } = body;

  if (!firstName || !lastName || !email_id || !password) {
    const err = new Error("Please provide all the required fields!");
    err.statusCode = 400;
    throw err;
  }

  const userExist = await checkUserExists(email_id);

  if (userExist.rows.length > 0) {
    const err = new Error("User already exists!");
    err.statusCode = 400;
    throw err;
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

export const loginService = async (body) => {
  const { email_id, password } = body;

  if (!email_id || !password) {
    const err = new Error("Please provide all the reuired fields!");
    err.statusCode = 400;
    throw err;
  }

  const user = await getExistingUser(email_id);

  if (user.rows.length === 0) {
    const err = new Error("User not found please register!");
    err.statusCode = 400;
    throw err;
  }

  const userData = user.rows[0];

  const isMatch = await bcrypt.compare(password, userData.password_hash);

  if (!isMatch) {
    const err = new Error("Password is wrong!");
    err.statusCode = 400;
    throw err;
  }

  const token = generateToken(
    userData.user_id,
    userData.firstName,
    userData.email_id,
  );

  return {
    token,
    user: {
      user_id: userData.user_id,
      firstname: userData.firstName,
      email_id: userData.email_id,
    },
  };
};
