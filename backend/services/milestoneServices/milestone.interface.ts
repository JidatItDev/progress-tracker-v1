// services/milestoneServices/milestone.interface.ts

export enum MilestoneStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  DELAYED = "delayed",
}

export interface milestoneData {
  projectId?: string;
  milestoneName?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  milestoneStatus?: MilestoneStatus;
  status?: "Y" | "N";
  createdAt?: Date;
  updatedAt?: Date;
}
