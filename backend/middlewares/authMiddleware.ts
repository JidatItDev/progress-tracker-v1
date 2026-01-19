import pkg from "express";
const express = pkg;
type Application = pkg.Application;
type Request = pkg.Request;
type Response = pkg.Response;
type NextFunction = pkg.NextFunction;
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Users, { UserRole } from "../models/userModel";

dotenv.config();


export const authenticateToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      role: string;
      email: string;
    };

    // ✅ FIX: use decoded.id
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await Users.findById(decoded.id)
      .select("-password")
      .lean();

    if (!user || user.status === "N") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Attach permissions (REQUIRED for checkPermission)
    req.user = {
      id: user._id,
      role: user.role,
      permissions: user.permissions,
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
