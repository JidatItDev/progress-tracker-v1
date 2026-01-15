import { Request, Response, NextFunction } from "express";
import { authService } from "../../services/authServices/authService";
import { AppError } from "../../utils/appError";

const { validationResult } = require('express-validator');

const authServiceInstance = new authService();
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(
        "Validation failed: " +
          errors.array().map((e: any) => e.msg).join(", "),
        400
      );
    }

    const { email, password } = req.body;

    const result = await authServiceInstance.login({
      email,
      password,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
