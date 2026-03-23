export interface Project {
  projectId: number;
  projectName: string;
  projectDescription: string;
  completionPercentage: number;
  startDate?: string;
  completionDate?: string;
  projectAddress: string;
  profileImage: string;
  reraNumber: string;
  budget: number;
  status: string;
  builderId: number;
  builderName?: string;
  totalSpend?: number;
  isActive: boolean;
}
