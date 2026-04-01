import express from "express";
import pool from "../config/auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

router.post("/register", async (req, res) => {
  const { firstName, lastName, email_id, password } = req.body;

  if (!firstName || !lastName || !email_id || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  const userExist = await pool.query(
    "SELECT * FROM users WHERE email_id = $1",
    [email_id],
  );

  if (userExist.rows.length > 0) {
    return res.status(400).json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users(firstName,lastName,email_id,password_hash) VALUES($1,$2,$3,$4) RETURNING user_id,firstName, lastName, email_id",
    [firstName, lastName, email_id, hashedPassword],
  );

  return res.status(201).json({ message: "User registered successfully!" });
});

router.post("/login", async (req, res) => {
  const { email_id, password } = req.body;

  if (!email_id || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required Fields!" });
  }

  const user = await pool.query("SELECT * FROM users WHERE email_id = $1", [
    email_id,
  ]);

  if (user.rows.length === 0) {
    return res.status(400).json({ message: "Invalid Credentials!" });
  }

  const userData = user.rows[0];

  const isMatch = await bcrypt.compare(password, userData.password_hash);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Credentials!" });
  }

  const token = generateToken(userData.user_id);

  res.cookie("token", token, cookieOptions);

  res.json({
    user: {
      user_id: userData.user_id,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email_id: userData.email_id,
    },
  });
});

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", { ...cookieOptions, maxAge: 1 });
  res.json({ message: "Logged out successfully!" });
});

export default router;
