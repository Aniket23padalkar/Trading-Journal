import { loginService, registerService } from "./authService.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, //30days
};

export const registerUser = async (req, res) => {
  try {
    const data = await registerService(req.body);
    res.status(201).json({ message: data.message });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { token, user } = await loginService(req.body);
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ user });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUser = async (req, res) => {
  res.status(200).json(req.user);
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Logged out successfully!" });
};
