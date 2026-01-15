import { Request, Response } from "express";
// import bcrypt from "bcryptjs";
import { userData } from "../authServices/user.interface";
import { AppError } from '../../utils/appError';  
import { handleError } from '../../utils/errorHandler';  
import Users, { IUserPermissions } from "../../models/userModel";
import { generateRandomPassword } from "../../utils/passwordGenerate";
import { welcomeUserTemplate } from "../../helpers/passwordMailTemplate";
import { sendMail } from "../../helpers/mailer";



const DEFAULT_PERMISSIONS: IUserPermissions = {
  overview: { view: false },
  projects: { view: false, create: false, update: false, delete: false },
  milestones: { view: false, create: false, update: false, delete: false },
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

      // -----------------------------
      // ✅ FIX: Correct Mongoose check (not Sequelize)
      // -----------------------------
      const existingUser = await Users.findOne({ email: cleanEmail }).lean();

      if (existingUser) {
        throw new AppError("User with this email already exists.", 409);
      }

      // -----------------------------
      // ✅ Keep old password logic (auto generated)
      // -----------------------------
      const password = generateRandomPassword(8);

      // -----------------------------
      // Save user in DB (add permissions)
      // -----------------------------
      const newUser = new Users({
        name: cleanName,
        email: cleanEmail,
        password, // ✅ unchanged
        role,
        permissions: permissions ?? DEFAULT_PERMISSIONS, // ✅ from form
      });

      const savedUser = await newUser.save();

      // Prepare email
      const mailTemplate = welcomeUserTemplate({
        name: cleanName,
        email: cleanEmail,
        password, // ✅ unchanged
      });

      // Send email
      await sendMail({
        to: cleanEmail,
        subject: mailTemplate.subject,
        html: mailTemplate.html,
      });

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

      console.log("the role is:", role);

      if (!id) {
        throw new AppError("Bad Request! id is required.", 400);
      }

      const existingUser = await Users.findById(id);
      if (!existingUser) {
        throw new AppError("User not found", 404);
      }

      // -----------------------------
      // Update name (optional)
      // -----------------------------
      if (name !== undefined) {
        const cleanName = String(name).trim();
        if (!cleanName) {
          throw new AppError("name cannot be empty.", 400);
        }
        existingUser.name = cleanName;
      }

      // -----------------------------
      // Update email (optional) + uniqueness check
      // -----------------------------
      if (email !== undefined) {
        const cleanEmail = String(email).trim().toLowerCase();
        if (!cleanEmail) {
          throw new AppError("email cannot be empty.", 400);
        }

        // If email changed, ensure no duplicates
        if (cleanEmail !== String(existingUser.email).toLowerCase()) {
          const duplicate = await Users.findOne({
            _id: { $ne: id },
            email: cleanEmail,
          }).lean();

          if (duplicate) {
            throw new AppError("User with this email already exists.", 409);
          }
        }

        existingUser.email = cleanEmail;
      }

      // -----------------------------
      // Update role (optional)
      // -----------------------------
      if (role !== undefined) {
        const cleanRole = String(role).trim();
        if (!cleanRole) {
          throw new AppError("role cannot be empty.", 400);
        }
        existingUser.role = cleanRole as any;
      }

      // -----------------------------
      // ✅ Update permissions (optional) - from form
      // -----------------------------
      if (permissions !== undefined) {
        existingUser.permissions = permissions as any;
      }

      const updatedUser = await existingUser.save();

      return {
        success: true,
        message: "User updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          permissions: updatedUser.permissions, // ✅ return permissions
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
      console.log("checking user",user)
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
    sortField: string = 'createdAt', 
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<any> {
    try {
      const filterConditions: any = { status: 'Y' };

      if (filters.name) {
        filterConditions.name = { $regex: filters.name, $options: 'i' };  
      }

      if (filters.email) {
        filterConditions.email = { $regex: filters.email, $options: 'i' };  
      }

      const skip = (page - 1) * limit;
      const users = await Users.find(filterConditions)
        .skip(skip)  
        .limit(limit)  
        .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });

      const totalCount = await Users.countDocuments(filterConditions);

      return {
        success: true,
        message: 'Users retrieved successfully',
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
