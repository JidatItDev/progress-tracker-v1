import mongoose, { Document, Schema, Model, Types } from "mongoose";

/** SubMilestone document interface */
export interface ISubMilestone extends Document {
  projectId: Types.ObjectId;
  milestoneId: Types.ObjectId;
  submilestoneName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: "Y" | "N";
  createdAt: Date;
  updatedAt: Date;
}

/** SubMilestone schema */
export const SubMilestoneSchema: Schema<ISubMilestone> = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
      index: true,
    },

    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestones",
      required: true,
      index: true,
    },

    submilestoneName: {
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

/** SubMilestone model */
const SubMilestones: Model<ISubMilestone> =
  mongoose.model<ISubMilestone>("SubMilestones", SubMilestoneSchema);

export default SubMilestones;
