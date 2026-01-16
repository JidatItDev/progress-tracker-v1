import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { userData } from "../authServices/user.interface";
import { AppError } from '../../utils/appError';  
import { handleError } from '../../utils/errorHandler';  
import Users, { IUserPermissions } from "../../models/userModel";
import { generateRandomPassword } from "../../utils/passwordGenerate";
import { welcomeUserTemplate } from "../../helpers/passwordMailTemplate";
import { sendMail } from "../../helpers/mailer";
import { mergePermissions } from "../../helpers/mergePermissions";



const DEFAULT_PERMISSIONS: IUserPermissions = {
  overview: { view: false },
  projects: { view: false, create: false, update: false, delete: false },
  milestones: { view: false, create: false, update: false, delete: false },
  submilestones: { view: false, create: false, update: false, delete: false },
  delay: { view: false, create: false, update: false, delete: false },
  clients: { view: false, create: false, update: false },
  activity: { view: false },
  users: { view: false, create: false, update: false },
  admin: { view: false },
};


export class UserService {
 async createUser(data: userData): Promise<any> {
    try {
      const { name, email, role, permissions } = data;

      if (!name || !email || !role) {
        throw new AppError("Bad Request! Missing required fields.", 400);
      }

      const cleanName = String(name).trim();
      const cleanEmail = String(email).trim().toLowerCase();

      if (!cleanName) {
        throw new AppError("name is required.", 400);
      }

      if (!cleanEmail) {
        throw new AppError("email is required.", 400);
      }

      // Prevent duplicate email
      const existingUser = await Users.findOne({ email: cleanEmail }).lean();
      if (existingUser) {
        throw new AppError("User with this email already exists.", 409);
      }

      //ONLY ONE ADMIN ALLOWED
      if (role === "admin") {
        const existingAdmin = await Users.findOne({
          role: "admin",
          status: "Y",
        }).lean();

        if (existingAdmin) {
          throw new AppError("Only one admin is allowed in the system.", 409);
        }
      }

      // Generate & hash password
      const plainPassword = generateRandomPassword(8);
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Merge permissions safely
      const finalPermissions = mergePermissions(
        DEFAULT_PERMISSIONS,
        permissions
      );

      // Save user
      const newUser = new Users({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword, 
        role,
        permissions: finalPermissions, 
        status: "Y",
      });

      const savedUser = await newUser.save();

      // Send credentials via email
      const mailTemplate = welcomeUserTemplate({
        name: cleanName,
        email: cleanEmail,
        password: plainPassword, 
      });

      await sendMail({
        to: cleanEmail,
        subject: mailTemplate.subject,
        html: mailTemplate.html,
      });

      // Response
      return {
        success: true,
        message: "User created successfully. Credentials sent via email.",
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          permissions: savedUser.permissions,
        },
      };
    } catch (err) {
      return handleError(err as AppError);
    }
  }


 async updateUser(data: userData): Promise<any> {
    try {
      const { id, name, email, role, permissions } = data;

      if (!id) {
        throw new AppError("User id is required.", 400);
      }

      const user = await Users.findById(id);
      if (!user) {
        throw new AppError("User not found.", 404);
      }

      // Update name
      if (name !== undefined) {
        const cleanName = String(name).trim();
        if (!cleanName) {
          throw new AppError("name cannot be empty.", 400);
        }
        user.name = cleanName;
      }

      // Update email + duplicate check
      if (email !== undefined) {
        const cleanEmail = String(email).trim().toLowerCase();
        if (!cleanEmail) {
          throw new AppError("email cannot be empty.", 400);
        }

        if (cleanEmail !== user.email) {
          const duplicate = await Users.findOne({
            _id: { $ne: id },
            email: cleanEmail,
          }).lean();

          if (duplicate) {
            throw new AppError(
              "User with this email already exists.",
              409
            );
          }
        }

        user.email = cleanEmail;
      }

      // Enforce ONLY ONE ADMIN
      if (role !== undefined && role !== user.role) {
        if (role === "admin") {
          const existingAdmin = await Users.findOne({
            role: "admin",
            status: "Y",
            _id: { $ne: id },
          }).lean();

          if (existingAdmin) {
            throw new AppError(
              "Only one admin is allowed in the system.",
              409
            );
          }
        }

        user.role = role as any;
      }

      // Update permissions (safe merge)
      if (permissions !== undefined) {
        user.permissions = mergePermissions(
          DEFAULT_PERMISSIONS,
          permissions
        );
      }

      const updatedUser = await user.save();

      return {
        success: true,
        message: "User updated successfully.",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          permissions: updatedUser.permissions,
          status: updatedUser.status,
        },
      };
    } catch (err) {
      return handleError(err as AppError);
    }
  }


async deleteUser(data: { id: string }): Promise<any> {
  try {
    const { id } = data;

    const user = await Users.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.status === "N") {
      throw new AppError("User is already deleted.", 400);
    }

    user.status = "N";
    await user.save();

    return {
      success: true,
      message: "User successfully deleted.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    };
  } catch (err) {
    return handleError(err as AppError);
  }
}


async getUsers(
  page: number = 1,
  limit: number = 10,
  filters: { name?: string; email?: string; status?: string } = {},
  sortField: string = "createdAt",
  sortOrder: "asc" | "desc" = "asc"
): Promise<any> {
  try {
    const filterConditions: any = { status: "Y" };

    if (filters.name) {
      filterConditions.name = { $regex: filters.name, $options: "i" };
    }

    if (filters.email) {
      filterConditions.email = { $regex: filters.email, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const users = await Users.find(filterConditions)
      .select("-password") 
      .skip(skip)
      .limit(limit)
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
      .lean(); // optional but recommended

    const totalCount = await Users.countDocuments(filterConditions);

    return {
      success: true,
      message: "Users retrieved successfully",
      data: users,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    };
  } catch (err) {
    return handleError(err as AppError);
  }
}


async getTeamMembers() {
  try {
    const teamUsers = await Users.find(
      { role: "team", status: "Y" },   
      { password: 0 }                  
    )
      .select("_id name email role")  
      .lean();

    return {
      success: true,
      message: "Team members retrieved successfully",
      users: teamUsers,
    };
  } catch (err) {
    return handleError(err as AppError);
  }
}
}
