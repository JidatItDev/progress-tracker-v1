import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError"; // adjust path

const { validationResult } = require("express-validator");

import delayServiceInstance from "../../services/delayServices/delayService"; // adjust path

export const createDelayController = async (
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
    const { projectId, milstoneId, delayReason, days } = req.body;

    // -----------------------------
    // Call service
    // -----------------------------
    const result = await delayServiceInstance.createDelay({
      projectId,
      milstoneId,
      delayReason,
      days,
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




export const updateDelayController = async (
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
    // Extract request params + body
    // -----------------------------
    const delayId = req.params.id;
    const { projectId, milstoneId, delayReason, days } = req.body;

    // -----------------------------
    // Call service
    // -----------------------------
    const result = await delayServiceInstance.updateDelay(
      delayId,
      {
        projectId,
        milstoneId,
        delayReason,
        days,
      }
    );

    // -----------------------------
    // Handle service-level failure
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


export const deleteDelayController = async (
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
    // Extract request params
    // -----------------------------
    const delayId = req.params.id;

    // -----------------------------
    // Call service
    // -----------------------------
    const result = await delayServiceInstance.deleteDelay(delayId, {
        projectId: "",
        milstoneId: "",
        delayReason: "",
        days: 0
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
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const getDelaysByMilstoneIdController = async (
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
    const milstoneId = req.params.id;

    // -----------------------------
    // Call service
    // -----------------------------
    const result = await delayServiceInstance.getDelaysByMilstoneId(milstoneId);

    // -----------------------------
    // Handle service-level failure
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