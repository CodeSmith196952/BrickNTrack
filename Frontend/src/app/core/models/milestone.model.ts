export interface Milestone {
  milestoneId: number;
  projectId: number;
  milestoneName: string;
  milestoneDetails: string;
  budget: number;
  budgetStatus: string;
  status: string;
  plannedStartDate?: string;
  plannedTargetDate?: string;
  plannedDuration: number;
  actualStartDate?: string;
  actualTargetDate?: string;
  actualDuration?: number;
  milestoneCompletionPer: number;
  isActive: boolean;
}
