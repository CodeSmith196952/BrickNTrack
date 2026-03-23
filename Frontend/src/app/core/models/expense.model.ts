export interface Expense {
  expenseId: number;
  details: string;
  amount: number;
  vendorSupplier: string;
  category: string;
  projectMilestoneId: number;
  paymentStatus?: string;
  paymentMode?: string;
  paymentDate?: string;
  invoicePath?: string;
  notes?: string;
  totalCost?: number;
  isActive: boolean;
}
