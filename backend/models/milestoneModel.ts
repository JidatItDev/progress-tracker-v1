import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { MilestoneStatus } from "../services/milestoneServices/milestone.interface";

export interface IMilestone extends Document {
  projectId: Types.ObjectId;
  milestoneName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  milestoneStatus: MilestoneStatus; 
  status: "Y" | "N";
  createdAt: Date;
  updatedAt: Date;
}

export const MilestoneSchema = new Schema<IMilestone>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
      index: true,
    },

    milestoneName: {
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

    milestoneStatus: {
      type: String,
      enum: Object.values(MilestoneStatus) as string[], 
      default: MilestoneStatus.ACTIVE,
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

const Milestones: Model<IMilestone> = mongoose.model<IMilestone>(
  "Milestones",
  MilestoneSchema
);

export default Milestones;