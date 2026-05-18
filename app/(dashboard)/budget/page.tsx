'use client';

import { useState, FormEvent } from 'react';
import { useBudget } from '@/hooks/useBudget';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '@/types';
import type { ExpenseCategory } from '@/types';
import { Plus, Pencil, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const MONTHS = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return { label: d.toLocaleString('default', { month: 'long', year: 'numeric' }), value: `${y}-${m}` };
});

const nowMonth = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
})();

export default function BudgetPage() {
  const [selectedMonth, setSelectedMonth] = useState(nowMonth);
  const { budgets, loading, createBudget, updateBudget, deleteBudget } = useBudget(selectedMonth);

  // Spending data for this month
  const [spending, setSpending] = useState<Record<string, number>>({});
  useState(() => {
    api.get<{ byCategory: { category: string; total: number }[] }>('/api/dashboard/summary')
      .then(({ data }) => {
        const map: Record<string, number> = {};
        data.byCategory.forEach(c => { map[c.category] = c.total; });
        setSpending(map);
      })
      .catch(() => {});
  });

  // Form state
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Food');
  const [formLimit, setFormLimit] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!formLimit) return;
    setSubmitting(true);
    const ok = await createBudget({ category: formCategory, limit: parseFloat(formLimit), month: selectedMonth });
    if (ok) { setFormCategory('Food'); setFormLimit(''); }
    setSubmitting(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editLimit) return;
    await updateBudget(id, parseFloat(editLimit));
    setEditId(null);
    setEditLimit('');
  };

  const getBudgetStatus = (limit: number, spent: number) => {
    const pct = (spent / limit) * 100;
    if (pct >= 100) return { color: '#ef4444', label: 'Over budget!', icon: AlertTriangle };
    if (pct >= 80) return { color: '#eab308', label: `${pct.toFixed(0)}% used`, icon: AlertTriangle };
    return { color: '#22c55e', label: `${pct.toFixed(0)}% used`, icon: CheckCircle };
  };

  const usedCategories = budgets.map(b => b.category);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Budget</h1>
          <p className="text-slate-400 text-sm mt-0.5">Set monthly limits per category</p>
        </div>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
          className="input-field w-auto min-w-[180px] py-2 text-sm">
          {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      {/* Add Budget Form */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Set New Budget Limit
        </h2>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="label">Category</label>
            <select value={formCategory} onChange={e => setFormCategory(e.target.value as ExpenseCategory)}
              className="input-field py-2.5 text-sm">
              {EXPENSE_CATEGORIES.filter(c => !usedCategories.includes(c)).map(c => (
                <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="label">Monthly Limit ($)</label>
            <input type="number" min="1" step="0.01" value={formLimit}
              onChange={e => setFormLimit(e.target.value)}
              className="input-field py-2.5 text-sm" placeholder="500.00" required />
          </div>
          <button type="submit" disabled={submitting || usedCategories.length === EXPENSE_CATEGORIES.length}
            className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap">
            {submitting ? 'Saving...' : 'Set Limit'}
          </button>
        </form>
        {usedCategories.length === EXPENSE_CATEGORIES.length && (
          <p className="text-xs text-slate-500 mt-2">All categories have budgets set for this month.</p>
        )}
      </div>

      {/* Budget Cards */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-5">
              <div className="skeleton h-4 w-32 mb-3 rounded" />
              <div className="skeleton h-3 w-full rounded" />
            </div>
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-slate-500 text-sm">No budgets set for this month. Add your first limit above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map((budget) => {
            const spent = spending[budget.category] || 0;
            const pct = Math.min((spent / budget.limit) * 100, 100);
            const status = getBudgetStatus(budget.limit, spent);
            const catColor = CATEGORY_COLORS[budget.category as ExpenseCategory] || '#6366f1';
            const StatusIcon = status.icon;

            return (
              <div key={budget._id} className="glass-card p-5 hover:border-slate-600/60 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CATEGORY_ICONS[budget.category as ExpenseCategory]}</span>
                    <span className="font-semibold text-slate-200">{budget.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-4 h-4" style={{ color: status.color }} />
                    <span className="text-xs font-medium" style={{ color: status.color }}>{status.label}</span>
                    <button onClick={() => { setEditId(budget._id); setEditLimit(String(budget.limit)); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all ml-1">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteBudget(budget._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: status.color }} />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>${spent.toFixed(2)} spent</span>
                  <span>Limit: ${budget.limit.toFixed(2)}</span>
                </div>

                {editId === budget._id && (
                  <div className="mt-3 flex gap-2 items-center">
                    <input type="number" min="1" step="0.01" value={editLimit}
                      onChange={e => setEditLimit(e.target.value)}
                      className="input-field py-2 text-sm flex-1" placeholder="New limit" />
                    <button onClick={() => handleUpdate(budget._id)} className="btn-primary text-sm py-2 px-4">Save</button>
                    <button onClick={() => setEditId(null)} className="btn-secondary text-sm py-2 px-3">✕</button>
                  </div>
                )}

                {/* Color accent bar */}
                <div className="mt-3 h-0.5 rounded-full opacity-40" style={{ backgroundColor: catColor }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
