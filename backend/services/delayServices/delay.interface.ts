export interface delayData {
    projectId: string;
    milstoneId: string;
    delayReason: string;
    days: number;
    status: "Y" | "N";
}