import mongoose, { Document, Schema, Model } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  TEAM = "team",
  CLIENT = "client",
}

/** ---- Permissions Types ---- */
export interface IPermissionModuleViewOnly {
  view: boolean;
}

export interface IPermissionModuleCrud {
  view: boolean;
  create: boolean;
  update: boolean;   // ✅ added
  delete: boolean;
}

export interface IPermissionModuleViewCreateUpdate {
  view: boolean;
  create: boolean;
  update: boolean;   // ✅ added
}

export interface IUserPermissions {
  overview: IPermissionModuleViewOnly;
  projects: IPermissionModuleCrud;
  milestones: IPermissionModuleCrud;
  clients: IPermissionModuleViewCreateUpdate;
  activity: IPermissionModuleViewOnly;
  users: IPermissionModuleViewCreateUpdate;
  admin: IPermissionModuleViewOnly;
}

/** ---- User Document ---- */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  date: Date;
  role: UserRole;
  status: "Y" | "N";
  permissions: IUserPermissions; // ✅
  createdAt: Date;
}

/** ---- Permissions Schema ---- */
const PermissionsSchema = new Schema<IUserPermissions>(
  {
    overview: {
      view: { type: Boolean, default: false },
    },

    projects: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false }, // ✅
      delete: { type: Boolean, default: false },
    },

    milestones: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false }, // ✅
      delete: { type: Boolean, default: false },
    },

    clients: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false }, // ✅
    },

    activity: {
      view: { type: Boolean, default: false },
    },

    users: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false }, // ✅
    },

    admin: {
      view: { type: Boolean, default: false },
    },
  },
  { _id: false }
);

/** ---- User Schema ---- */
const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CLIENT,
      required: true,
    },

    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },

    permissions: {
      type: PermissionsSchema,
      required: true,
      default: () => ({
        overview: { view: false },
        projects: { view: false, create: false, update: false, delete: false },
        milestones: { view: false, create: false, update: false, delete: false },
        clients: { view: false, create: false, update: false },
        activity: { view: false },
        users: { view: false, create: false, update: false },
        admin: { view: false },
      }),
    },

    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Users: Model<IUser> = mongoose.model<IUser>("Users", UserSchema);
export default Users;
