'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Expense, ExpensesResponse, Pagination } from '@/types';
import toast from 'react-hot-toast';

interface UseExpensesOptions {
  category?: string;
  month?: string;
  page?: number;
}

export const useExpenses = (options: UseExpensesOptions = {}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {};
      if (options.category) params.category = options.category;
      if (options.month) params.month = options.month;
      if (options.page) params.page = options.page;

      const { data } = await api.get<ExpensesResponse>('/api/expenses', { params });
      setExpenses(data.expenses);
      setPagination(data.pagination);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load expenses';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [options.category, options.month, options.page]);

  useEffect(() => {
    void fetchExpenses();
  }, [fetchExpenses]);

  const createExpense = async (payload: Omit<Expense, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      await api.post('/api/expenses', payload);
      toast.success('Expense added!');
      await fetchExpenses();
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add expense';
      toast.error(msg);
      return false;
    }
  };

  const updateExpense = async (id: string, payload: Partial<Expense>): Promise<boolean> => {
    try {
      await api.put(`/api/expenses/${id}`, payload);
      toast.success('Expense updated!');
      await fetchExpenses();
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update expense';
      toast.error(msg);
      return false;
    }
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/api/expenses/${id}`);
      toast.success('Expense deleted!');
      await fetchExpenses();
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete expense';
      toast.error(msg);
      return false;
    }
  };

  return {
    expenses,
    pagination,
    loading,
    error,
    refetch: fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};
