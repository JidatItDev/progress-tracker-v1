import { UserRole } from "../models/userModel";



import "express-serve-static-core";

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  status: "Y" | "N";
}



declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

export {};
