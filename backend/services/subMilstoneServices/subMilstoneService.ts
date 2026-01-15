import Milestones from "../../models/milestoneModel";
import Project from "../../models/projectModel";
import SubMilestones from "../../models/submilestoneModel";
import { AppError } from "../../utils/appError";
import { handleError } from "../../utils/errorHandler";
import { submilestoneData } from "./submilestone.interface";



export class subMilestoneService {
async createSubMilestone(
    data: submilestoneData
  ): Promise<any> {
    try {
      const {
        projectId,
        milestoneId,
        submilestoneName,
        description,
        startDate,
        endDate,
      } = data;

    // -----------------------------
    // Basic required field checks
    // -----------------------------
    if (!projectId || !milestoneId || !submilestoneName || !startDate || !endDate) {
      throw new AppError("Bad Request! Missing required fields.", 400);
    }

    const cleanSubmilestoneName = String(submilestoneName).trim();
    if (!cleanSubmilestoneName) {
      throw new AppError("submilestoneName is required.", 400);
    }

    if (cleanSubmilestoneName.length > 120) {
      throw new AppError("submilestoneName must be less than 120 characters.", 400);
    }

    const cleanDescription = String(description ?? "").trim();
    if (!cleanDescription) {
      throw new AppError("description is required.", 400);
    }

    if (cleanDescription.length > 5000) {
      throw new AppError("description must be less than 5000 characters.", 400);
    }

    // -----------------------------
    // Date validation
    // -----------------------------
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime())) {
      throw new AppError("Invalid startDate.", 400);
    }

    if (isNaN(parsedEndDate.getTime())) {
      throw new AppError("Invalid endDate.", 400);
    }

    if (parsedEndDate < parsedStartDate) {
      throw new AppError("endDate cannot be earlier than startDate.", 400);
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
      _id: milestoneId,
      projectId,
      status: "Y",
    }).lean();

    if (!milestone) {
      throw new AppError("Milestone not found for this project.", 404);
    }

    // -----------------------------
    // Date consistency checks
    // -----------------------------
    if (parsedStartDate < new Date(milestone.startDate)) {
      throw new AppError(
        "Sub-milestone startDate cannot be before milestone startDate.",
        400
      );
    }

    if (parsedEndDate > new Date(milestone.endDate)) {
      throw new AppError(
        "Sub-milestone endDate cannot be after milestone endDate.",
        400
      );
    }

    // -----------------------------
    // Duplicate sub-milestone check
    // -----------------------------
    const existing = await SubMilestones.findOne({
      projectId,
      milestoneId,
      submilestoneName: cleanSubmilestoneName,
      status: "Y",
    }).lean();

    if (existing) {
      throw new AppError(
        "Sub-milestone with this name already exists for this milestone.",
        409
      );
    }

    // -----------------------------
    // Create Sub-milestone
    // -----------------------------
    const newSubMilestone = new SubMilestones({
      projectId,
      milestoneId,
      submilestoneName: cleanSubmilestoneName,
      description: cleanDescription,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      status: "Y",
    });

    const savedSubMilestone = await newSubMilestone.save();

    // -----------------------------
    // Populate references for response
    // -----------------------------
    const populatedSubMilestone = await SubMilestones.findById(savedSubMilestone._id)
      .populate({ path: "projectId", model: "Projects" })
      .populate({ path: "milestoneId", model: "Milestones" })
      .lean();

    return {
      success: true,
      message: "Sub-milestone created successfully.",
      subMilestone: {
        id: populatedSubMilestone._id,
        submilestoneName: populatedSubMilestone.submilestoneName,
        description: populatedSubMilestone.description,
        startDate: populatedSubMilestone.startDate,
        endDate: populatedSubMilestone.endDate,
        status: populatedSubMilestone.status,
        project: populatedSubMilestone.projectId,
        milestone: populatedSubMilestone.milestoneId,
      },
    };
  } catch (err) {
    return handleError(err as AppError);
  }
}

async updateSubMilestone(
    subMilestoneId: string,
    data: submilestoneData
  ): Promise<any> {
    try {
      const {
        projectId,
        milestoneId,
        submilestoneName,
        description,
        startDate,
        endDate,
      } = data;

      // -----------------------------
      // Basic required field checks
      // -----------------------------
      if (!subMilestoneId || !projectId || !milestoneId) {
        throw new AppError("Bad Request! Missing required fields.", 400);
      }

      // -----------------------------
      // Fetch existing Sub-milestone
      // -----------------------------
      const existingSubMilestone = await SubMilestones.findById(subMilestoneId);

      if (!existingSubMilestone || existingSubMilestone.status === "N") {
        throw new AppError("Sub-milestone not found.", 404);
      }

      // -----------------------------
      // Fetch & validate Project
      // -----------------------------
      const project = await Project.findById(projectId).lean();

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
        _id: milestoneId,
        projectId,
        status: "Y",
      }).lean();

      if (!milestone) {
        throw new AppError("Milestone not found for this project.", 404);
      }

      // -----------------------------
      // Name validation (if provided)
      // -----------------------------
      if (submilestoneName !== undefined) {
        const cleanName = String(submilestoneName).trim();

        if (!cleanName) {
          throw new AppError("submilestoneName cannot be empty.", 400);
        }

        if (cleanName.length > 120) {
          throw new AppError("submilestoneName must be less than 120 characters.", 400);
        }

        const duplicate = await SubMilestones.findOne({
          _id: { $ne: subMilestoneId },
          projectId,
          milestoneId,
          submilestoneName: cleanName,
          status: "Y",
        }).lean();

        if (duplicate) {
          throw new AppError(
            "Sub-milestone with this name already exists for this milestone.",
            409
          );
        }

        existingSubMilestone.submilestoneName = cleanName;
      }

      // -----------------------------
      // Description validation
      // -----------------------------
      if (description !== undefined) {
        const cleanDescription = String(description).trim();

        if (!cleanDescription) {
          throw new AppError("description cannot be empty.", 400);
        }

        if (cleanDescription.length > 5000) {
          throw new AppError("description must be less than 5000 characters.", 400);
        }

        existingSubMilestone.description = cleanDescription;
      }

      // -----------------------------
      // Date validation
      // -----------------------------
      const parsedStartDate = startDate
        ? new Date(startDate)
        : existingSubMilestone.startDate;

      const parsedEndDate = endDate
        ? new Date(endDate)
        : existingSubMilestone.endDate;

      if (isNaN(parsedStartDate.getTime())) {
        throw new AppError("Invalid startDate.", 400);
      }

      if (isNaN(parsedEndDate.getTime())) {
        throw new AppError("Invalid endDate.", 400);
      }

      if (parsedEndDate < parsedStartDate) {
        throw new AppError("endDate cannot be earlier than startDate.", 400);
      }

      if (parsedStartDate < new Date(milestone.startDate)) {
        throw new AppError(
          "Sub-milestone startDate cannot be before milestone startDate.",
          400
        );
      }

      if (parsedEndDate > new Date(milestone.endDate)) {
        throw new AppError(
          "Sub-milestone endDate cannot be after milestone endDate.",
          400
        );
      }

      existingSubMilestone.startDate = parsedStartDate;
      existingSubMilestone.endDate = parsedEndDate;

      // -----------------------------
      // Save updates
      // -----------------------------
      const updatedSubMilestone = await existingSubMilestone.save();

      // -----------------------------
      // Populate response
      // -----------------------------
      const populatedSubMilestone = await SubMilestones.findById(updatedSubMilestone._id)
        .populate({ path: "projectId", model: "Projects" })
        .populate({ path: "milestoneId", model: "Milestones" })
        .lean();

      return {
        success: true,
        message: "Sub-milestone updated successfully.",
        subMilestone: {
          id: populatedSubMilestone._id,
          submilestoneName: populatedSubMilestone.submilestoneName,
          description: populatedSubMilestone.description,
          startDate: populatedSubMilestone.startDate,
          endDate: populatedSubMilestone.endDate,
          status: populatedSubMilestone.status,
          project: populatedSubMilestone.projectId,
          milestone: populatedSubMilestone.milestoneId,
        },
      };
    } catch (err) {
      return handleError(err as AppError);
    }
}

async deleteSubMilestone(subMilestoneId: string): Promise<any> {
    try {
      // -----------------------------
      // Validate input
      // -----------------------------
      if (!subMilestoneId) {
        throw new AppError("Sub-milestone id is required.", 400);
      }

      // -----------------------------
      // Fetch Sub-milestone
      // -----------------------------
      const subMilestone = await SubMilestones.findById(subMilestoneId);

      if (!subMilestone) {
        throw new AppError("Sub-milestone not found.", 404);
      }

      if (subMilestone.status === "N") {
        throw new AppError("Sub-milestone is already deleted.", 400);
      }

      // -----------------------------
      // Soft delete
      // -----------------------------
      subMilestone.status = "N";
      const deletedSubMilestone = await subMilestone.save();

      // -----------------------------
      // Populate response
      // -----------------------------
      const populatedSubMilestone = await SubMilestones.findById(deletedSubMilestone._id)
        .populate({ path: "projectId", model: "Projects" })
        .populate({ path: "milestoneId", model: "Milestones" })
        .lean();

      return {
        success: true,
        message: "Sub-milestone deleted successfully.",
        subMilestone: {
          id: populatedSubMilestone._id,
          submilestoneName: populatedSubMilestone.submilestoneName,
          description: populatedSubMilestone.description,
          startDate: populatedSubMilestone.startDate,
          endDate: populatedSubMilestone.endDate,
          status: populatedSubMilestone.status,
          project: populatedSubMilestone.projectId,
          milestone: populatedSubMilestone.milestoneId,
        },
      };
    } catch (err) {
      return handleError(err as AppError);
    }
}

async getSubMilestones(
    projectId: string,
    milestoneId: string
  ): Promise<any> {
    try {
      // -----------------------------
      // Validate input
      // -----------------------------
      if (!projectId || !milestoneId) {
        throw new AppError("projectId and milestoneId are required.", 400);
      }

      // -----------------------------
      // Fetch Project with creator & team
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
      // Fetch Milestone
      // -----------------------------
      const milestone = await Milestones.findOne({
        _id: milestoneId,
        projectId,
        status: "Y",
      }).lean();

      if (!milestone) {
        throw new AppError("Milestone not found for this project.", 404);
      }

      // -----------------------------
      // Fetch Sub-milestones list
      // -----------------------------
      const subMilestones = await SubMilestones.find({
        projectId,
        milestoneId,
        status: "Y",
      })
        .sort({ startDate: 1 })
        .lean();

      // -----------------------------
      // Response (ORDER MATTERS)
      // -----------------------------
      return {
        success: true,
        message: "Sub-milestones fetched successfully.",

        subMilestones,
        creator: project.userId,
        project,
        teamMembers: project.teamMembers, 
        milestone,
      };
    } catch (err) {
      return handleError(err as AppError);
    }
}
}
