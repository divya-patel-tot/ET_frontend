export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Health'
  | 'Entertainment'
  | 'Bills'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Shopping',
  'Health',
  'Entertainment',
  'Bills',
  'Other',
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Shopping: '#a855f7',
  Health: '#22c55e',
  Entertainment: '#ec4899',
  Bills: '#eab308',
  Other: '#6b7280',
};

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Food: '🍔',
  Transport: '🚗',
  Shopping: '🛍️',
  Health: '💊',
  Entertainment: '🎬',
  Bills: '📄',
  Other: '📦',
};

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  _id: string;
  userId: string;
  category: ExpenseCategory;
  limit: number;
  month: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ExpensesResponse {
  expenses: Expense[];
  pagination: Pagination;
}

export interface DashboardSummary {
  totalThisMonth: number;
  byCategory: { category: ExpenseCategory; total: number }[];
  monthlyTrend: { month: string; total: number }[];
  recentExpenses: Expense[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ExtractedExpense {
  amount: number | null;
  category: ExpenseCategory | null;
  date: string | null;
  note: string | null;
}
