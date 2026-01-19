import { IUserPermissions } from "../models/userModel";
import { Request, Response, NextFunction } from "express";


export const checkPermission =
  (module: keyof IUserPermissions, action: string) =>
  (req: any, res: Response, next: NextFunction) => {

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const allowed = user.permissions?.[module]?.[action];

    if (allowed !== true) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
};
