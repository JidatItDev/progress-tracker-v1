import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import { projectService } from "../../services/projectServices/projectService";

const { validationResult } = require("express-validator");

const projectServiceInstance = new projectService();

export const createProjectController = async (
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

    const {
      userId,
      projectName,
      description,
      startDate,
      endDate,
      priority,
      teamMembers,
    } = req.body;

    const result = await projectServiceInstance.createProject({
      userId,
      projectName,
      description,
      startDate,
      endDate,
      priority,
      teamMembers,
    } as any);

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};


export const updateProjectController = async (
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

    // Accept projectId from params (recommended) or body
    const projectId = req.params.id || req.body.projectId;

    const {
      userId,
      projectName,
      description,
      startDate,
      endDate,
      priority,
      projectStatus,
      teamMembers, 
    } = req.body;

    const result = await projectServiceInstance.updateProject({
      projectId,
      userId,
      projectName,
      description,
      startDate,
      endDate,
      priority,
      projectStatus,
      teamMembers,
    } as any);

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const deleteProjectController = async (
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
    const userId = req.user?.id || req.body.userId; // comes from auth middleware

    // if (!userId) {
    //   throw new AppError("Unauthorized.", 401);
    // }

    const result = await projectServiceInstance.deleteProject({
      projectId,
      userId,
    });

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};



export const getProjectsController = async (
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

    const result = await projectServiceInstance.getProjects(req.query);

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
