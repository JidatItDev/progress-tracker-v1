import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import { subMilestoneService } from "../../services/subMilstoneServices/subMilstoneService";

const { validationResult } = require("express-validator");

const subMilestoneServiceInstance = new subMilestoneService();

export const createSubMilestoneController = async (
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
    // Extract request body
    // -----------------------------
    const {
      projectId,
      milestoneId,
      submilestoneName,
      description,
      startDate,
      endDate,
    } = req.body;

    // -----------------------------
    // Call service
    // -----------------------------
    const result = await subMilestoneServiceInstance.createSubMilestone({
        projectId,
        milestoneId,
        submilestoneName,
        description,
        startDate,
        endDate,
        status: "Y",
        createdAt: undefined,
        updatedAt: undefined
    });

    // -----------------------------
    // Handle service-level failure
    // -----------------------------
    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    // -----------------------------
    // Success response
    // -----------------------------
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};


export const updateSubMilestoneController = async (
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
    // Extract params & body
    // -----------------------------
    const subMilestoneId = req.params.id;

    console.log("The subMilestoneId is:", subMilestoneId);

    const {
      projectId,
      milestoneId,
      submilestoneName,
      description,
      startDate,
      endDate,
    } = req.body;

    // -----------------------------
    // Call service
    // -----------------------------
    const result = await subMilestoneServiceInstance.updateSubMilestone(
      subMilestoneId,
      {
        projectId,
        milestoneId,
        submilestoneName,
        description,
        startDate,
        endDate,
        status: "Y",
        createdAt: undefined,
        updatedAt: undefined,
      }
    );

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const deleteSubMilestoneController = async (
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
    // Extract params
    // -----------------------------
    const subMilestoneId = req.params.id;

    // -----------------------------
    // Call service
    // -----------------------------
    const result = await subMilestoneServiceInstance.deleteSubMilestone(
      subMilestoneId
    );

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const getSubMilestonesController = async (
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
    // Extract params / query
    // -----------------------------
    const { projectId, milestoneId } = req.query;

    // -----------------------------
    // Call service
    // -----------------------------
    const result = await subMilestoneServiceInstance.getSubMilestones(
      String(projectId),
      String(milestoneId)
    );

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};