// controllers/progress.controller.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError"; 
import ProgressService  from "../../services/projectDashboards/progressTrackerService"; 

const  { validationResult }  = require ("express-validator");

export const getProjectProgressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(
        "Validation failed: " +
          errors.array().map((e: any) => e.msg).join(", "),
        400
      );
    }

    const projectId = req.params.id;

    const result = await ProgressService.getProjectProgress(projectId);

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
