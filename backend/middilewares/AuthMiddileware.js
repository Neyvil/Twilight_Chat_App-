import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import asyncHandler from "./asyncHandler.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      console.error("Token verification error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

export default verifyToken ;
