'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Budget } from '@/types';
import toast from 'react-hot-toast';

export const useBudget = (month: string) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<{ budgets: Budget[] }>('/api/budget', {
        params: { month },
      });
      setBudgets(data.budgets);
    } catch {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    void fetchBudgets();
  }, [fetchBudgets]);

  const createBudget = async (payload: { category: string; limit: number; month: string }): Promise<boolean> => {
    try {
      await api.post('/api/budget', payload);
      toast.success('Budget set!');
      await fetchBudgets();
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to set budget';
      toast.error(msg);
      return false;
    }
  };

  const updateBudget = async (id: string, limit: number): Promise<boolean> => {
    try {
      await api.put(`/api/budget/${id}`, { limit });
      toast.success('Budget updated!');
      await fetchBudgets();
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update budget';
      toast.error(msg);
      return false;
    }
  };

  const deleteBudget = async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/api/budget/${id}`);
      toast.success('Budget removed!');
      await fetchBudgets();
      return true;
    } catch {
      toast.error('Failed to delete budget');
      return false;
    }
  };

  return { budgets, loading, refetch: fetchBudgets, createBudget, updateBudget, deleteBudget };
};
