import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { projectStatus } from "../services/projectServices/project.interface";

/** Priority enum */
enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

/** Project document interface */
interface IProject extends Document {
  userId: Types.ObjectId;
  projectName: string;
  client: string;
  description: string;
  startDate: Date;
  endDate: Date;
  priority: Priority;
  teamMembers: string;
  projectStatus: projectStatus;
  status: "Y" | "N";
  createdAt: Date;
  updatedAt: Date;
}

/** Project schema */
export const ProjectSchema: Schema<IProject> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },

    projectName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    client: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: any, value: Date) {
          return !this.startDate || value >= this.startDate;
        },
        message: "endDate must be greater than or equal to startDate",
      },
    },

    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
      required: true,
    },

    teamMembers: [
      {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
      },
    ],

    projectStatus: {
      type: String,
      enum: Object.values(projectStatus),
      default: projectStatus.ACTIVE,
      required: true,
    },

    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: true, 
  }
);


const Project: Model<IProject> = mongoose.model<IProject>("Projects", ProjectSchema);
export default Project;