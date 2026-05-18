'use client';

import { useState, useEffect, FormEvent } from 'react';
import { X } from 'lucide-react';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from '@/types';
import type { Expense, ExpenseCategory } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Partial<Expense>) => Promise<void>;
  initialData?: Expense | null;
  prefill?: Partial<Expense>;
}

export function ExpenseModal({ open, onClose, onSave, initialData, prefill }: Props) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAmount(String(initialData.amount));
      setCategory(initialData.category);
      setDate(new Date(initialData.date).toISOString().split('T')[0]);
      setNote(initialData.note || '');
    } else if (prefill) {
      if (prefill.amount) setAmount(String(prefill.amount));
      if (prefill.category) setCategory(prefill.category);
      if (prefill.date) setDate(new Date(prefill.date).toISOString().split('T')[0]);
      if (prefill.note) setNote(prefill.note);
    } else {
      setAmount('');
      setCategory('Other');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
  }, [initialData, prefill, open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    setSaving(true);
    await onSave({ amount: parseFloat(amount), category, date, note: note || undefined });
    setSaving(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-card p-6 glow-indigo animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">{initialData ? 'Edit Expense' : 'Add Expense'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Amount ($)</label>
            <input type="number" min="0.01" step="0.01" value={amount}
              onChange={e => setAmount(e.target.value)}
              className="input-field" placeholder="0.00" required />
          </div>
          <div>
            <label className="label">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)}
              className="input-field" required>
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="input-field" required />
          </div>
          <div>
            <label className="label">Note <span className="text-slate-600 font-normal">(optional)</span></label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              className="input-field" placeholder="e.g. Lunch at Subway" maxLength={200} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
              ) : (initialData ? 'Update' : 'Add Expense')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
