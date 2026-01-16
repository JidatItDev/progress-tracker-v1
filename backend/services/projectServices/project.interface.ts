export enum projectStatus {
  ACTIVE = "active",
  COMPLETED = "completed", 
  DELAYED = "delayed"
}

export interface projectData {
    userId: string;
    projectName: string;
    description: string;
    client: string;
    startDate: Date;
    endDate: Date;
    priority: string;
    teamMembers: string;
    projectStatus: projectStatus;
    status: "Y" | "N";
    createdAt: Date;
    updatedAt: Date;
}
