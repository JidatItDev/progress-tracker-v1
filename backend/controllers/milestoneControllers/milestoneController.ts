import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import { milestoneService } from "../../services/milestoneServices/milestoneService";
import { MilestoneStatus } from "../../services/milestoneServices/milestone.interface";

const { validationResult } = require("express-validator");

const milestoneServiceInstance = new milestoneService();

export const createMilestoneController = async (
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

    const { projectId, milestoneName, description, startDate, endDate } = req.body;

    const result = await milestoneServiceInstance.createMilestone({
      projectId,
      milestoneName,
      description,
      startDate,
      endDate,
      status: "Y",
      createdAt: undefined,
      updatedAt: undefined,
    });

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};


export const updateMilestoneController = async (
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

    const milestoneId = req.params.id;
    const { milestoneName, description, startDate, endDate } = req.body;

    const result = await milestoneServiceInstance.updateMilestone({
      milestoneId,
      milestoneName,
      description,
      startDate,
      endDate,
      projectId: "",
      status: "Y",
      createdAt: undefined,
      updatedAt: undefined,
      milestoneStatus: MilestoneStatus.ACTIVE, //  FIX
    });

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};



export const deleteMilestoneController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const milestoneId = req.params.id;
    if (!milestoneId) throw new AppError("milestoneId is required in params.", 400);

    const result = await milestoneServiceInstance.deleteMilestone(milestoneId);

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};



export const getMilestonesController = async (
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

    const result = await milestoneServiceInstance.getMilestones(req.query);

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMilestonesByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // -----------------------------
    // express-validator check
    // -----------------------------
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(
        "Validation failed: " +
          errors.array().map((e: any) => e.msg).join(", "),
        400
      );
    }

    // -----------------------------
    // Extract milestoneId
    // -----------------------------
    const milestoneId = req.params.id || req.query.id;

    // -----------------------------
    // Call service
    // -----------------------------
    const result =
      await milestoneServiceInstance.getMilestonesbyId({
        milestoneId,
      });

    // -----------------------------
    // Handle service error
    // -----------------------------
    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    // -----------------------------
    // Success response
    // -----------------------------
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
