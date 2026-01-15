export interface submilestoneData {
    projectId: string;
    milestoneId: string;
    submilestoneName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: "Y" | "N";
    createdAt: Date;
    updatedAt: Date;
}