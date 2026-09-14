import jwt from "jsonwebtoken";
import db from "../database/db.js";


const key = '1234JRT';

export const AuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, key);

    // Attach decoded info
    req.user = decoded;

    // Fetch user from DB using promise
    const [result] = await db.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [decoded.email]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach DB user to request
    req.userData = result[0];

    // Everything OK → go to next middleware / route
    next();
  } catch (error) {
    console.error("AuthMiddleware error:", error);
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};
