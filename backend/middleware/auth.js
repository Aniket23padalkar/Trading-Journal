import jwt from "jsonwebtoken";
import pool from "../config/auth.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await pool.query(
      "SELECT user_id, firstName, lastName, email_id FROM users WHERE user_id = $1",
      [decoded.id],
    );

    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found!" });
    }

    req.user = user.rows[0];
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Not authorized, token failed!" });
  }
};
