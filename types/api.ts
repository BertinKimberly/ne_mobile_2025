export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: string;
  description: string;
  createdAt: string;
  category?: string;
  title?: string;
  date?: string;
  paymentMethod?: string;
  userId: string; // Make userId required
}

export type CreateExpenseDto = Omit<Expense, 'id' | 'createdAt'>;
export type UpdateExpenseDto = Partial<CreateExpenseDto>;