import { AppError } from "../../utils/appError";
import Project from "../../models/projectModel";
import { projectData } from "../../services/projectServices/project.interface";
import Users from "../../models/userModel";
import { handleError } from "../../utils/errorHandler";
import Milestones from "../../models/milestoneModel";


export class projectService {
async createProject(data: projectData): Promise<any> {
  try {
    const {
      userId,
      projectName,
      client,
      description,
      startDate,
      endDate,
      priority,
      teamMembers,
    } = data;

    if (!userId || !projectName || !client || !startDate || !endDate || !priority) {
      throw new AppError("Bad Request! Missing required fields.", 400);
    }

    const cleanProjectName = String(projectName).trim();
    if (!cleanProjectName) {
      throw new AppError("Project name is required.", 400);
    }

    if (cleanProjectName.length > 255) {
      throw new AppError("Project name must be less than 255 characters.", 400);
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime())) throw new AppError("Invalid startDate.", 400);
    if (isNaN(parsedEndDate.getTime())) throw new AppError("Invalid endDate.", 400);
    if (parsedEndDate < parsedStartDate) {
      throw new AppError("endDate cannot be earlier than startDate.", 400);
    }

    const allowedPriorities = ["low", "medium", "high"];
    if (!allowedPriorities.includes(priority)) {
      throw new AppError("Invalid priority. Allowed values: low, medium, high.", 400);
    }

    let normalizedTeamMembers: string[] = [];

    if (teamMembers) {
      if (Array.isArray(teamMembers)) {
        normalizedTeamMembers = teamMembers.map((id) => String(id).trim()).filter(Boolean);
      } else if (typeof teamMembers === "string") {
        normalizedTeamMembers = teamMembers
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
      } else {
        throw new AppError(
          "teamMembers must be an array of strings or a comma-separated string.",
          400
        );
      }

      if (normalizedTeamMembers.length > 100) {
        throw new AppError("teamMembers limit exceeded (max 100).", 400);
      }
    }

    const user = await Users.findById(userId);
    if (!user) throw new AppError("User not found.", 404);
    if (user.status === "N") throw new AppError("User account is disabled.", 403);

    const existingProject = await Project.findOne({
      userId: user._id,
      projectName: cleanProjectName,
    });

    if (existingProject) {
      throw new AppError("Project with this name already exists for this user.", 409);
    }

    const newProject = new Project({
      userId: user._id,
      projectName: cleanProjectName,
      client: client.trim(), 
      description: description?.trim() || "",
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      priority,
      teamMembers: normalizedTeamMembers,
    });

    const savedProject = await newProject.save();

    const teamMemberIds = normalizedTeamMembers.length ? normalizedTeamMembers : [];

    const teamMembersData = teamMemberIds.length
      ? await Users.find({ _id: { $in: teamMemberIds } }, { name: 1, email: 1, role: 1 }).lean()
      : [];

    // NOTE: replace "Milestones" with your actual milestone model name/import
    const [totalMilestones, completedMilestones] = await Promise.all([
      Milestones.countDocuments({ projectId: savedProject._id }),
      Milestones.countDocuments({ projectId: savedProject._id, milestoneStatus: "completed" }),
    ]);

    const completion =
      totalMilestones === 0 ? 0 : Math.round((completedMilestones / totalMilestones) * 100);

    return {
      success: true,
      message: "Project created successfully.",
      project: {
        id: savedProject._id,
        projectName: savedProject.projectName,
        description: savedProject.description,
        startDate: savedProject.startDate,
        endDate: savedProject.endDate,
        priority: savedProject.priority,

        // ✅ added attributes
        milestone: totalMilestones,
        completion,

        createdBy: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },

        teamMembers: teamMembersData.map((member) => ({
          id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
        })),
      },
    };
  } catch (err) {
    return handleError(err as AppError);
  }
}

async updateProject(data: projectData): Promise<any> {
  try {
    const {
      projectId,
      userId,
      projectName,
      client, // ✅ NEW
      description,
      startDate,
      endDate,
      projectStatus,
      priority,
      teamMembers,
    } = data as any;

    if (!projectId || !userId) {
      throw new AppError("Bad Request! Missing required fields.", 400);
    }

    const user = await Users.findById(userId);
    if (!user) throw new AppError("User not found.", 404);
    if (user.status === "N") throw new AppError("User account is disabled.", 403);

    const project = await Project.findById(projectId);
    if (!project) throw new AppError("Project not found.", 404);

    const updates: any = {};

    if (projectName !== undefined) {
      const cleanProjectName = String(projectName).trim();
      if (!cleanProjectName) throw new AppError("Project name is required.", 400);
      if (cleanProjectName.length > 255) {
        throw new AppError("Project name must be less than 255 characters.", 400);
      }

      const duplicate = await Project.findOne({
        _id: { $ne: project._id },
        userId: user._id,
        projectName: cleanProjectName,
      }).lean();

      if (duplicate) {
        throw new AppError("Project with this name already exists for this user.", 409);
      }

      updates.projectName = cleanProjectName;
    }

    // ✅ NEW: update client
    if (client !== undefined) {
      const cleanClient = String(client).trim();
      if (!cleanClient) {
        throw new AppError("Client cannot be empty.", 400);
      }
      updates.client = cleanClient;
    }

    if (description !== undefined) {
      updates.description = String(description).trim();
    }

    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;

    if (startDate !== undefined) {
      parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) throw new AppError("Invalid startDate.", 400);
      updates.startDate = parsedStartDate;
    }

    if (endDate !== undefined) {
      parsedEndDate = new Date(endDate);
      if (isNaN(parsedEndDate.getTime())) throw new AppError("Invalid endDate.", 400);
      updates.endDate = parsedEndDate;
    }

    const finalStart = parsedStartDate ?? project.startDate;
    const finalEnd = parsedEndDate ?? project.endDate;

    if (finalEnd < finalStart) {
      throw new AppError("endDate cannot be earlier than startDate.", 400);
    }

    if (priority !== undefined) {
      const allowedPriorities = ["low", "medium", "high"];
      if (!allowedPriorities.includes(priority)) {
        throw new AppError("Invalid priority. Allowed values: low, medium, high.", 400);
      }
      updates.priority = priority;
    }

    if (teamMembers !== undefined) {
      let normalizedTeamMembers: string[] = [];

      if (Array.isArray(teamMembers)) {
        normalizedTeamMembers = teamMembers.map(id => String(id).trim()).filter(Boolean);
      } else if (typeof teamMembers === "string") {
        normalizedTeamMembers = teamMembers.split(",").map(id => id.trim()).filter(Boolean);
      } else {
        throw new AppError(
          "teamMembers must be an array of strings or a comma-separated string.",
          400
        );
      }

      if (normalizedTeamMembers.length > 100) {
        throw new AppError("teamMembers limit exceeded (max 100).", 400);
      }

      updates.teamMembers = normalizedTeamMembers;
    }

    updates.projectStatus = projectStatus;

    const updatedProject = await Project.findByIdAndUpdate(
      project._id,
      { $set: updates },
      { new: true }
    );

    if (!updatedProject) throw new AppError("Project update failed.", 500);

    const teamMembersData = Array.isArray(updatedProject.teamMembers)
      ? await Users.find(
          { _id: { $in: updatedProject.teamMembers } },
          { name: 1, email: 1 }
        ).lean()
      : [];

    return {
      success: true,
      message: "Project updated successfully.",
      project: {
        id: updatedProject._id,
        projectName: updatedProject.projectName,
        client: updatedProject.client, // ✅ RETURN
        description: updatedProject.description,
        startDate: updatedProject.startDate,
        endDate: updatedProject.endDate,
        priority: updatedProject.priority,

        createdBy: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },

        teamMembers: teamMembersData.map(member => ({
          id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
        })),
      },
    };
  } catch (err) {
    return handleError(err as AppError);
  }
}

async deleteProject(data: { projectId: string; userId: string }): Promise<any> {
  try {
    const { projectId, userId } = data;

    if (!projectId || !userId) {
      throw new AppError("Bad Request! Missing required fields.", 400);
    }

    // Load user
    const user = await Users.findById(userId);
    if (!user) throw new AppError("User not found.", 404);
    if (user.status === "N") throw new AppError("User account is disabled.", 403);

    // Load project
    const project = await Project.findById(projectId);
    if (!project) throw new AppError("Project not found.", 404);

    // Optional ownership check (keep if you don’t fully rely on ABAC)
    // if (String(project.userId) !== String(user._id)) {
    //   throw new AppError("You are not allowed to delete this project.", 403);
    // }

    // Already deleted?
    if (project.status === "N") {
      throw new AppError("Project is already deleted.", 400);
    }

    // Soft delete
    project.status = "N";
    await project.save();

    return {
      success: true,
      message: "Project deleted successfully.",
      project: {
        id: project._id,
        status: project.status,
      },
    };
  } catch (err) {
    return handleError(err as AppError);
  }
}

async getProjects(query: any): Promise<any> {
  try {
    // -------- 1) Pagination --------
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    // -------- 2) Filters --------
    const filter: any = {};
    filter.status = query.status ? String(query.status).toUpperCase() : "Y";

    if (query.userId) {
      filter.userId = query.userId;
    }

    if (query.priority) {
      const allowedPriorities = ["low", "medium", "high"];
      const pr = String(query.priority).toLowerCase();
      if (!allowedPriorities.includes(pr)) {
        throw new AppError("Invalid priority filter. Allowed: low, medium, high.", 400);
      }
      filter.priority = pr;
    }

    if (query.search) {
      const search = String(query.search).trim();
      if (search) filter.projectName = { $regex: search, $options: "i" };
    }

    if (query.startFrom || query.startTo) {
      filter.startDate = {};
      if (query.startFrom) {
        const d = new Date(query.startFrom);
        if (isNaN(d.getTime())) throw new AppError("Invalid startFrom date.", 400);
        filter.startDate.$gte = d;
      }
      if (query.startTo) {
        const d = new Date(query.startTo);
        if (isNaN(d.getTime())) throw new AppError("Invalid startTo date.", 400);
        filter.startDate.$lte = d;
      }
    }

    if (query.endFrom || query.endTo) {
      filter.endDate = {};
      if (query.endFrom) {
        const d = new Date(query.endFrom);
        if (isNaN(d.getTime())) throw new AppError("Invalid endFrom date.", 400);
        filter.endDate.$gte = d;
      }
      if (query.endTo) {
        const d = new Date(query.endTo);
        if (isNaN(d.getTime())) throw new AppError("Invalid endTo date.", 400);
        filter.endDate.$lte = d;
      }
    }

    // -------- 3) Query DB + Populate Users --------
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "userId",
          model: "Users",
          select: "-password",
        })
        .populate({
          path: "teamMembers",
          model: "Users",
          select: "-password",
        })
        .lean(),
      Project.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    // -------- 4) Add milestone + completion for each project (single aggregation) --------
    const projectIds = projects.map((p: any) => p._id);

    let milestoneStatsByProjectId = new Map<string, { total: number; completed: number }>();

    if (projectIds.length) {
      // NOTE: replace "Milestone" with your actual milestone model import/name
      const stats = await Milestones.aggregate([
        { $match: { projectId: { $in: projectIds } } },
        {
          $group: {
            _id: "$projectId",
            total: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [{ $eq: ["$milestoneStatus", "completed"] }, 1, 0],
              },
            },
          },
        },
      ]);

      milestoneStatsByProjectId = new Map(
        stats.map((s: any) => [String(s._id), { total: s.total, completed: s.completed }])
      );
    }

    const projectsWithMilestones = projects.map((p: any) => {
      const stat = milestoneStatsByProjectId.get(String(p._id)) || { total: 0, completed: 0 };
      const completion = stat.total === 0 ? 0 : Math.round((stat.completed / stat.total) * 100);

      return {
        ...p,
        // client is already part of p if it's in schema and not excluded
        milestone: stat.total,
        completion,
      };
    });

    // -------- 5) Return --------
    return {
      success: true,
      message: "Projects retrieved successfully.",
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
      projects: projectsWithMilestones,
    };
  } catch (err) {
    return handleError(err as AppError);
  }
}
}