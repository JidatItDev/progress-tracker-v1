// services/delay.service.ts
import Delays from "../../models/delayModel";
import Project from "../../models/projectModel"; // adjust path to your Project model
import Milestones from "../../models/milestoneModel"; // adjust path to your Milestones model
import { AppError } from "../../utils/appError"; // adjust path
import { handleError } from "../../utils/errorHandler"; // adjust path

export interface delayData {
  projectId: string;
  milstoneId: string; // keep column name as requested
  delayReason: string;
  days: number;
}

class DelayService {
  async createDelay(data: delayData): Promise<any> {
    try {
      const { projectId, milstoneId, delayReason, days } = data;

      // -----------------------------
      // Basic required field checks
      // -----------------------------
      if (!projectId || !milstoneId || !delayReason || days === undefined || days === null) {
        throw new AppError("Bad Request! Missing required fields.", 400);
      }

      const cleanDelayReason = String(delayReason).trim();
      if (!cleanDelayReason) {
        throw new AppError("delayReason is required.", 400);
      }

      if (cleanDelayReason.length > 2000) {
        throw new AppError("delayReason must be less than 2000 characters.", 400);
      }

      const parsedDays = Number(days);
      if (!Number.isFinite(parsedDays) || Number.isNaN(parsedDays)) {
        throw new AppError("days must be a valid number.", 400);
      }

      // if you want to allow only whole-day delays:
      if (!Number.isInteger(parsedDays)) {
        throw new AppError("days must be an integer.", 400);
      }

      if (parsedDays < 1) {
        throw new AppError("days must be at least 1.", 400);
      }

      // -----------------------------
      // Fetch & validate Project
      // -----------------------------
      const project = await Project.findById(projectId)
        .populate({ path: "userId", model: "Users", select: "-password" })
        .populate({ path: "teamMembers", model: "Users", select: "-password" })
        .lean();

      if (!project) {
        throw new AppError("Project not found.", 404);
      }

      if (project.status === "N") {
        throw new AppError("Project is deleted.", 400);
      }

      // -----------------------------
      // Fetch & validate Milestone
      // -----------------------------
      const milestone = await Milestones.findOne({
        _id: milstoneId,
        projectId,
        status: "Y",
      }).lean();

      if (!milestone) {
        throw new AppError("Milestone not found for this project.", 404);
      }

      // -----------------------------
      // Create Delay
      // -----------------------------
      const newDelay = new Delays({
        projectId,
        milstoneId,
        delayReason: cleanDelayReason,
        days: parsedDays,
      });

      const savedDelay = await newDelay.save();

      // -----------------------------
      // Populate references for response
      // -----------------------------
      const populatedDelay = await Delays.findById(savedDelay._id)
        .populate({ path: "projectId", model: "Projects" })
        .populate({ path: "milstoneId", model: "Milestones" })
        .lean();

      return {
        success: true,
        message: "Delay created successfully.",
        delay: {
          id: populatedDelay?._id,
          delayReason: populatedDelay?.delayReason,
          days: populatedDelay?.days,
          project: populatedDelay?.projectId,
          milestone: populatedDelay?.milstoneId,
          createdAt: populatedDelay?.createdAt,
          updatedAt: populatedDelay?.updatedAt,
        },
      };
    } catch (err) {
      return handleError(err as AppError);
    }
  }

   async updateDelay(delayId: string, data: delayData): Promise<any> {
    try {
      const { projectId, milstoneId, delayReason, days } = data;

      // -----------------------------
      // Basic required field checks
      // -----------------------------
      if (!delayId) {
        throw new AppError("Bad Request! delayId is required.", 400);
      }

      // must update at least one field
      const hasAnyField =
        projectId !== undefined ||
        milstoneId !== undefined ||
        delayReason !== undefined ||
        days !== undefined;

      if (!hasAnyField) {
        throw new AppError("Bad Request! Nothing to update.", 400);
      }

      // -----------------------------
      // Fetch existing Delay
      // -----------------------------
      const existingDelay = await Delays.findById(delayId).lean();
      if (!existingDelay) {
        throw new AppError("Delay not found.", 404);
      }

      // -----------------------------
      // Prepare update object
      // -----------------------------
      const updateObj: any = {};

      if (projectId !== undefined) updateObj.projectId = projectId;
      if (milstoneId !== undefined) updateObj.milstoneId = milstoneId;

      if (delayReason !== undefined) {
        const cleanDelayReason = String(delayReason).trim();
        if (!cleanDelayReason) {
          throw new AppError("delayReason is required.", 400);
        }
        if (cleanDelayReason.length > 2000) {
          throw new AppError("delayReason must be less than 2000 characters.", 400);
        }
        updateObj.delayReason = cleanDelayReason;
      }

      if (days !== undefined) {
        const parsedDays = Number(days);
        if (!Number.isFinite(parsedDays) || Number.isNaN(parsedDays)) {
          throw new AppError("days must be a valid number.", 400);
        }
        if (!Number.isInteger(parsedDays)) {
          throw new AppError("days must be an integer.", 400);
        }
        if (parsedDays < 1) {
          throw new AppError("days must be at least 1.", 400);
        }
        updateObj.days = parsedDays;
      }

      // -----------------------------
      // Validate Project (if changed)
      // -----------------------------
      if (updateObj.projectId) {
        const project = await Project.findById(updateObj.projectId)
          .populate({ path: "userId", model: "Users", select: "-password" })
          .populate({ path: "teamMembers", model: "Users", select: "-password" })
          .lean();

        if (!project) {
          throw new AppError("Project not found.", 404);
        }
        if (project.status === "N") {
          throw new AppError("Project is deleted.", 400);
        }
      }

      // -----------------------------
      // Validate Milestone (if changed OR if project changed)
      // Ensure milestone belongs to project
      // -----------------------------
      const effectiveProjectId = updateObj.projectId ?? String(existingDelay.projectId);
      const effectiveMilstoneId = updateObj.milstoneId ?? String(existingDelay.milstoneId);

      // If either was provided, we re-validate pairing.
      const milestoneNeedsValidation =
        updateObj.projectId !== undefined || updateObj.milstoneId !== undefined;

      if (milestoneNeedsValidation) {
        const milestone = await Milestones.findOne({
          _id: effectiveMilstoneId,
          projectId: effectiveProjectId,
          status: "Y",
        }).lean();

        if (!milestone) {
          throw new AppError("Milestone not found for this project.", 404);
        }
      }

      // -----------------------------
      // Update Delay
      // -----------------------------
      const updated = await Delays.findByIdAndUpdate(delayId, updateObj, {
        new: true,
        runValidators: true,
      })
        .populate({ path: "projectId", model: "Projects" })
        .populate({ path: "milstoneId", model: "Milestones" })
        .lean();

      return {
        success: true,
        message: "Delay updated successfully.",
        delay: {
          id: updated?._id,
          delayReason: updated?.delayReason,
          days: updated?.days,
          project: updated?.projectId,
          milestone: updated?.milstoneId,
          createdAt: updated?.createdAt,
          updatedAt: updated?.updatedAt,
        },
      };
    } catch (err) {
      return handleError(err as AppError);
    }
  }


  async deleteDelay(delayId: string, data: delayData): Promise<any> {
    try {
      // -----------------------------
      // Basic required field checks
      // -----------------------------
      if (!delayId) {
        throw new AppError("Bad Request! delayId is required.", 400);
      }

      // -----------------------------
      // Fetch & validate Delay
      // -----------------------------
      const existingDelay = await Delays.findById(delayId).lean();

      if (!existingDelay) {
        throw new AppError("Delay not found.", 404);
      }

      if (existingDelay.status === "N") {
        throw new AppError("Delay is already deleted.", 400);
      }

      // -----------------------------
      // Soft delete (status -> N)
      // -----------------------------
      const updated = await Delays.findByIdAndUpdate(
        delayId,
        { status: "N" },
        { new: true, runValidators: true }
      )
        .populate({ path: "projectId", model: "Projects" })
        .populate({ path: "milstoneId", model: "Milestones" })
        .lean();

      return {
        success: true,
        message: "Delay deleted successfully.",
        delay: {
          id: updated?._id,
          status: updated?.status,
          project: updated?.projectId,
          milestone: updated?.milstoneId,
          updatedAt: updated?.updatedAt,
        },
      };
    } catch (err) {
      return handleError(err as AppError);
    }
  }

  
   async getDelaysByMilstoneId(milstoneId: string): Promise<any> {
    try {
      // -----------------------------
      // Basic required field checks
      // -----------------------------
      if (!milstoneId) {
        throw new AppError("Bad Request! milstoneId is required.", 400);
      }

      // -----------------------------
      // Fetch delays (only active)
      // -----------------------------
      const delays = await Delays.find({
        milstoneId,
        status: "Y",
      })
        .populate({ path: "projectId", model: "Projects" })
        .populate({ path: "milstoneId", model: "Milestones" })
        .sort({ createdAt: -1 })
        .lean();

      return {
        success: true,
        message: "Delays fetched successfully.",
        count: delays.length,
        delays: delays.map((d: any) => ({
          id: d._id,
          delayReason: d.delayReason,
          days: d.days,
          status: d.status,
          project: d.projectId,
          milestone: d.milstoneId,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        })),
      };
    } catch (err) {
      return handleError(err as AppError);
    }
  }
}

export default new DelayService();
