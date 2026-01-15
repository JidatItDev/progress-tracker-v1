// services/progress.service.ts
import mongoose from "mongoose";
import Milestones from "../../models/milestoneModel";
import Project from "../../models/projectModel";
import { AppError } from "../../utils/appError";
import { handleError } from "../../utils/errorHandler";

class ProgressService {
  async getProjectProgress(projectId: string): Promise<any> {
    try {
      if (!projectId) {
        throw new AppError("Bad Request! projectId is required.", 400);
      }

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new AppError("Invalid projectId.", 400);
      }

      const projectObjectId = new mongoose.Types.ObjectId(projectId);

      const totalMilestones = await Milestones.countDocuments({
        projectId: projectObjectId,
        status: "Y",
      });

      console.log("total milestones:", totalMilestones);

      const completedMilestones = await Milestones.countDocuments({
        projectId: projectObjectId,
        status: "Y",
        milestoneStatus: "completed",
      });

     console.log("completed milestones:", completedMilestones);


    const percentage =
    totalMilestones === 0
        ? 0
        : Math.round((completedMilestones / totalMilestones) * 100);

    if (percentage === 100) {
    await Project.findByIdAndUpdate(
        projectId,
        {
        projectStatus: "completed",
        },
        { new: true }
    );
    }


      return {
        success: true,
        message: "Project progress fetched successfully.",
        progress: {
          projectId,
          totalMilestones,
          completedMilestones,
          percentage,
        },
      };
    } catch (err) {
      return handleError(err as AppError);
    }
  }
}

export default new ProgressService();
