export interface ProjectMaster {
  projectId: number;
  projectName: string;
  projectDescription: string;
  completionPercentage: number;
  startDate?: Date;
  completionDate?: Date;
  projectAddress: string;
  profileImage: string;
  reraNumber: string;
  budget: number;
  status: string;
  builderId: number;
  builderName?: string;
  totalSpend?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqFt?: number;
  pricePerSqFt?: number;
  possessionStatus?: string;
  approvalType?: string;
  city?: string;
  state?: string;
  pincode?: string;
  amenities?: string;
  isFeatured?: boolean;
}

export interface BuilderMaster {
  builderId: number;
  name: string;
  tagLine: string;
  description: string;
  officeAddress: string;
  emailAddress: string;
  contact1: string;
  contact2: string;
  gstNo: string;
  ownerName: string;
}

export interface ProjectMilestone {
  milestoneId: number;
  projectId: number;
  milestoneName: string;
  milestoneDetails: string;
  budget: number;
  budgetStatus: string;
  status: string;
  plannedStartDate?: Date;
  plannedTargetDate?: Date;
  plannedDuration: number;
  actualStartDate?: Date;
  actualTargetDate?: Date;
  actualDuration: number;
  projectName: string;
  milestoneCompletionPer: number;
}

export interface ProjectExpense {
  expenseId: number;
  details: string;
  amount: number;
  vendorSupplier: string;
  category: string;
  projectMilestoneId: number;
  milestoneName: string;
  paymentStatus?: string;
  paymentMode?: string;
  paymentDate?: Date;
}

export interface Conversation {
  id: number;
  buyerUserId: number;
  buyerUserName: string;
  sellerUserId: number;
  sellerUserName: string;
  projectId?: number;
  projectName?: string;
  lastMessageAt: Date;
  lastMessageContent?: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderUserId: number;
  senderUserName: string;
  content: string;
  messageType: string;
  isRead: boolean;
  isFlagged: boolean;
  createdDate: Date;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  body: string;
  type: string;
  category?: string;
  isRead: boolean;
  actionUrl?: string;
  createdDate: Date;
}

export interface PropertyBooking {
  id: number;
  projectId: number;
  projectName: string;
  buyerUserId: number;
  buyerUserName: string;
  bookingAmount: number;
  paymentStatus: string;
  paymentMode?: string;
  transactionId?: string;
  notes?: string;
  createdDate: Date;
}

export interface Review {
  id: number;
  projectId: number;
  projectName: string;
  buyerUserId: number;
  buyerUserName: string;
  overallRating: number;
  qualityRating?: number;
  valueRating?: number;
  locationRating?: number;
  reviewText?: string;
  builderResponse?: string;
  builderResponseDate?: Date;
  createdDate: Date;
}

export interface CostMonitoring {
  projectId: number;
  projectName: string;
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  utilizationPercentage: number;
  stageWiseCosts: { stageName: string; budget: number; spent: number }[];
  recentExpenses: ProjectExpense[];
}
