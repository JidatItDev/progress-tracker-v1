import pkg from "express";
const express = pkg;
type Application = pkg.Application;
type Request = pkg.Request;
type Response = pkg.Response;
type NextFunction = pkg.NextFunction;
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRole } from "../models/userModel";

dotenv.config();


export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization"); // "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ status: 401, message: "Access Denied. No Token Provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      name: string;
      email?: string;
      role: UserRole;
      status: "Y" | "N";
    };

    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ status: 403, message: "Invalid Token" });
  }
};
