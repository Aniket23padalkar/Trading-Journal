import jwt from "jsonwebtoken";
import pool from "../config/auth.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      user_id: decoded.id,
      firstname: decoded.firstname,
      email_id: decoded.email_id,
    };
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Not authorized, token failed!" });
  }
};
