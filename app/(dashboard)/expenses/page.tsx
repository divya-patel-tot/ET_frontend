'use client';

import { useState } from 'react';
import {
  Plus, Filter, Download, ChevronLeft, ChevronRight,
  Pencil, Trash2, Search,
} from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '@/types';
import type { Expense, ExpenseCategory } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return { label: d.toLocaleString('default', { month: 'long', year: 'numeric' }), value: `${y}-${m}` };
});

export default function ExpensesPage() {
  const [category, setCategory] = useState('');
  const [month, setMonth] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const { expenses, pagination, loading, createExpense, updateExpense, deleteExpense } =
    useExpenses({ category: category || undefined, month: month || undefined, page });

  const handleEdit = (exp: Expense) => { setEditTarget(exp); setModalOpen(true); };
  const handleDelete = async (id: string) => {
    setDeleteId(id);
    await deleteExpense(id);
    setDeleteId(null);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params: Record<string, string> = {};
      if (month) params.month = month;
      const response = await api.get('/api/expenses/export', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses_${month || 'all'}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {pagination ? `${pagination.total} total expense${pagination.total !== 1 ? 's' : ''}` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleExport} disabled={exporting}
            className="btn-secondary flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="input-field w-auto min-w-[150px] py-2 text-sm">
          <option value="">All Categories</option>
          {EXPENSE_CATEGORIES.map(c => (
            <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
          ))}
        </select>
        <select value={month} onChange={e => { setMonth(e.target.value); setPage(1); }}
          className="input-field w-auto min-w-[180px] py-2 text-sm">
          <option value="">All Time</option>
          {MONTHS.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        {(category || month) && (
          <button onClick={() => { setCategory(''); setMonth(''); setPage(1); }}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3.5 w-40 rounded" />
                  <div className="skeleton h-3 w-28 rounded" />
                </div>
                <div className="skeleton h-4 w-20 rounded" />
              </div>
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Search className="w-10 h-10 text-slate-600" />
            <p className="text-slate-500 text-sm">No expenses found</p>
            <button onClick={() => { setEditTarget(null); setModalOpen(true); }}
              className="btn-primary text-sm mt-1">
              Add your first expense
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3">Category</th>
                    <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">Note</th>
                    <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">Date</th>
                    <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">Amount</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {expenses.map((exp) => {
                    const color = CATEGORY_COLORS[exp.category as ExpenseCategory] || '#6366f1';
                    const icon = CATEGORY_ICONS[exp.category as ExpenseCategory] || '📦';
                    return (
                      <tr key={exp._id} className="hover:bg-slate-700/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                              style={{ backgroundColor: `${color}22` }}>
                              {icon}
                            </div>
                            <span className="text-sm font-medium text-slate-200">{exp.category}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-400 truncate max-w-[200px] block">
                            {exp.note || <span className="italic text-slate-600">—</span>}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-400">
                            {new Date(exp.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-bold text-slate-100">${exp.amount.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(exp)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(exp._id)}
                              disabled={deleteId === exp._id}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-500">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="btn-secondary p-2 disabled:opacity-40">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}
                    className="btn-secondary p-2 disabled:opacity-40">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <ExpenseModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={async (payload) => {
          let ok = false;
          if (editTarget) {
            ok = await updateExpense(editTarget._id, payload);
          } else {
            ok = await createExpense(payload as Omit<Expense, '_id' | 'userId' | 'createdAt' | 'updatedAt'>);
          }
          if (ok) { setModalOpen(false); setEditTarget(null); }
        }}
        initialData={editTarget}
      />
    </div>
  );
}
