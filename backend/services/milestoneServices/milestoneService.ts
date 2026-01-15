import { AppError } from "../../utils/appError";
import Project from "../../models/projectModel";
import { projectData } from "../../services/projectServices/project.interface";
import Users from "../../models/userModel";
import { handleError } from "../../utils/errorHandler";
import Milestones from "../../models/milestoneModel";
import { milestoneData, MilestoneStatus } from "./milestone.interface";


export class milestoneService {


async createMilestone(data: milestoneData): Promise<any> {
    try {
      const { projectId, milestoneName, description, startDate, endDate } = data;

      if (!projectId || !milestoneName || !startDate || !endDate) {
        throw new AppError("Bad Request! Missing required fields.", 400);
      }

      const cleanMilestoneName = String(milestoneName).trim();
      if (!cleanMilestoneName) {
        throw new AppError("milestoneName is required.", 400);
      }

      if (cleanMilestoneName.length > 120) {
        throw new AppError("milestoneName must be less than 120 characters.", 400);
      }

      const cleanDescription = String(description ?? "").trim();
      if (!cleanDescription) {
        throw new AppError("description is required.", 400);
      }

      if (cleanDescription.length > 5000) {
        throw new AppError("description must be less than 5000 characters.", 400);
      }

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      if (isNaN(parsedStartDate.getTime())) throw new AppError("Invalid startDate.", 400);
      if (isNaN(parsedEndDate.getTime())) throw new AppError("Invalid endDate.", 400);
      if (parsedEndDate < parsedStartDate) {
        throw new AppError("endDate cannot be earlier than startDate.", 400);
      }

      const project = await Project.findById(projectId)
        .populate({ path: "userId", model: "Users", select: "-password" })
        .populate({ path: "teamMembers", model: "Users", select: "-password" })
        .lean();

      if (!project) throw new AppError("Project not found.", 404);
      if (project.status === "N") throw new AppError("Project is deleted.", 400);

      if (project.startDate && parsedStartDate < new Date(project.startDate)) {
        throw new AppError("Milestone startDate cannot be before project startDate.", 400);
      }
      if (project.endDate && parsedEndDate > new Date(project.endDate)) {
        throw new AppError("Milestone endDate cannot be after project endDate.", 400);
      }

      const existing = await Milestones.findOne({
        projectId,
        milestoneName: cleanMilestoneName,
        status: "Y",
      }).lean();

      if (existing) {
        throw new AppError("Milestone with this name already exists for this project.", 409);
      }

      const newMilestone = new Milestones({
        projectId,
        milestoneName: cleanMilestoneName,
        description: cleanDescription,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        status: "Y",
      });

      const savedMilestone = await newMilestone.save();

      return {
        success: true,
        message: "Milestone created successfully.",
        milestone: {
          id: savedMilestone._id,
          projectId: savedMilestone.projectId,
          milestoneName: savedMilestone.milestoneName,
          description: savedMilestone.description,
          startDate: savedMilestone.startDate,
          endDate: savedMilestone.endDate,
          status: savedMilestone.status,
        },
        project, 
      };
    } catch (err) {
      return handleError(err as AppError);
    }
}

async updateMilestone(
    data: milestoneData & { milestoneId: string }
  ): Promise<any> {
    try {
      const {
        milestoneId,
        milestoneName,
        description,
        startDate,
        endDate,
        milestoneStatus,
      } = data;

      if (!milestoneId) {
        throw new AppError("milestoneId is required.", 400);
      }

      // ---------- 1) Load milestone ----------
      const milestone = await Milestones.findById(milestoneId);
      if (!milestone) throw new AppError("Milestone not found.", 404);

      if (milestone.status === "N") {
        throw new AppError("Cannot update a deleted milestone.", 400);
      }

      // ---------- 2) Update name ----------
      if (milestoneName !== undefined) {
        const cleanName = milestoneName.trim();
        if (!cleanName) {
          throw new AppError("milestoneName cannot be empty.", 400);
        }
        if (cleanName.length > 120) {
          throw new AppError(
            "milestoneName must be less than 120 characters.",
            400
          );
        }
        milestone.milestoneName = cleanName;
      }

      // ---------- 3) Update description ----------
      if (description !== undefined) {
        const cleanDescription = description.trim();
        if (!cleanDescription) {
          throw new AppError("description cannot be empty.", 400);
        }
        if (cleanDescription.length > 5000) {
          throw new AppError(
            "description must be less than 5000 characters.",
            400
          );
        }
        milestone.description = cleanDescription;
      }

      // ---------- 4) Update milestoneStatus (ENUM SAFE) ----------
      if (milestoneStatus !== undefined) {
        if (!Object.values(MilestoneStatus).includes(milestoneStatus)) {
          throw new AppError(
            `Invalid milestoneStatus. Allowed values are: ${Object.values(
              MilestoneStatus
            ).join(", ")}`,
            400
          );
        }
        milestone.milestoneStatus = milestoneStatus;
      }

      // ---------- 5) Update dates ----------
      let parsedStartDate = milestone.startDate;
      let parsedEndDate = milestone.endDate;

      if (startDate !== undefined) {
        parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate.getTime())) {
          throw new AppError("Invalid startDate.", 400);
        }
        milestone.startDate = parsedStartDate;
      }

      if (endDate !== undefined) {
        parsedEndDate = new Date(endDate);
        if (isNaN(parsedEndDate.getTime())) {
          throw new AppError("Invalid endDate.", 400);
        }
        milestone.endDate = parsedEndDate;
      }

      if (parsedEndDate < parsedStartDate) {
        throw new AppError("endDate cannot be earlier than startDate.", 400);
      }

      // ---------- 6) Validate project ----------
      const project = await Project.findById(milestone.projectId)
        .populate({ path: "userId", model: "Users", select: "-password" })
        .populate({ path: "teamMembers", model: "Users", select: "-password" })
        .lean();

      if (!project) throw new AppError("Project not found.", 404);
      if (project.status === "N") throw new AppError("Project is deleted.", 400);

      if (project.startDate && milestone.startDate < project.startDate) {
        throw new AppError(
          "Milestone startDate cannot be before project startDate.",
          400
        );
      }

      if (project.endDate && milestone.endDate > project.endDate) {
        throw new AppError(
          "Milestone endDate cannot be after project endDate.",
          400
        );
      }

      // ---------- 7) Prevent duplicate name ----------
      if (milestoneName !== undefined) {
        const duplicate = await Milestones.findOne({
          _id: { $ne: milestoneId },
          projectId: milestone.projectId,
          milestoneName: milestone.milestoneName,
          status: "Y",
        });

        if (duplicate) {
          throw new AppError(
            "Milestone with this name already exists for this project.",
            409
          );
        }
      }

      // ---------- 8) Save ----------
      const updatedMilestone = await milestone.save();

      return {
        success: true,
        message: "Milestone updated successfully.",
        milestone: {
          id: updatedMilestone._id,
          projectId: updatedMilestone.projectId,
          milestoneName: updatedMilestone.milestoneName,
          description: updatedMilestone.description,
          startDate: updatedMilestone.startDate,
          endDate: updatedMilestone.endDate,
          milestoneStatus: updatedMilestone.milestoneStatus,
          status: updatedMilestone.status,
        },
        project,
      };
    } catch (err) {
      return handleError(err as AppError);
    }
}

async deleteMilestone(milestoneId: string): Promise<any> {
  try {
    if (!milestoneId) {
      throw new AppError("milestoneId is required.", 400);
    }

    const milestone = await Milestones.findById(milestoneId);
    if (!milestone) throw new AppError("Milestone not found.", 404);

    if (milestone.status === "N") {
      throw new AppError("Milestone is already deleted.", 400);
    }

    // Soft delete
    milestone.status = "N";
    await milestone.save();

    return {
      success: true,
      message: "Milestone deleted successfully.",
      milestone: {
        id: milestone._id,
        projectId: milestone.projectId,
        milestoneName: milestone.milestoneName,
        status: milestone.status,
      },
    };
  } catch (err) {
    return handleError(err as AppError);
  }
}

async getMilestones(query: any): Promise<any> {
  try {
    // -------- 1) Pagination --------
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    // -------- 2) Filters --------
    const filter: any = {};
    filter.status = query.status ? String(query.status).toUpperCase() : "Y";

    if (query.projectId) {
      filter.projectId = query.projectId;
    }

    if (query.search) {
      const search = String(query.search).trim();
      if (search) {
        filter.milestoneName = { $regex: search, $options: "i" };
      }
    }

    // -------- 3) Query DB --------
    const [milestones, total] = await Promise.all([
      Milestones.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "projectId",
          select: "projectName startDate endDate priority status",
          populate: { path: "userId", select: "name email role" }, // project creator
        })
        .lean(),
      Milestones.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    // -------- 4) Return --------
    return {
      success: true,
      message: "Milestones retrieved successfully.",
      meta: { total, page, limit, totalPages },
      milestones,
    };
  } catch (err) {
    return handleError(err as AppError);
  }
}
}