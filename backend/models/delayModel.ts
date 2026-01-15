import mongoose, { Document, Schema, Model, Types } from "mongoose";

/** Delay document interface */
export interface IDelay extends Document {
  projectId: Types.ObjectId;
  milstoneId: Types.ObjectId;
  delayReason: string;
  days: number;
  status: "Y" | "N";
  createdAt: Date;
  updatedAt: Date;
}

/** Delay schema */
export const DelaySchema: Schema<IDelay> = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
      index: true,
    },

    milstoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestones",
      required: true,
      index: true,
    },

    delayReason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    days: {
      type: Number,
      required: true,
      min: [1, "Delay days must be at least 1"],
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

/** Delay model */
const Delays: Model<IDelay> = mongoose.model<IDelay>(
  "Delays",
  DelaySchema
);

export default Delays;
