'use client';

import { useState } from 'react';
import { Sparkles, Send, RotateCcw, CheckCircle, AlertCircle, Wand2 } from 'lucide-react';
import api from '@/lib/api';
import type { ExtractedExpense, Expense } from '@/types';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { useExpenses } from '@/hooks/useExpenses';
import toast from 'react-hot-toast';

const EXAMPLE_TEXTS = [
  'Paid $45.99 at Whole Foods on 2024-01-15 for groceries',
  'Uber ride to downtown - $12.50 charged on Jan 16',
  'Netflix subscription renewed for $15.99 on January 1st',
  'CVS Pharmacy receipt: Medication $28.40, Date: 01/10/2024',
];

export default function AIFillPage() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedExpense | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { createExpense } = useExpenses();

  const handleExtract = async () => {
    if (!inputText.trim()) { toast.error('Please enter some text'); return; }
    setLoading(true);
    setExtracted(null);
    setError(null);
    try {
      const { data } = await api.post<{ extracted: ExtractedExpense }>('/api/ai/extract', { text: inputText });
      setExtracted(data.extracted);
      toast.success('AI extracted expense details!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'AI extraction failed. Please try again or fill manually.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setExtracted(null);
    setError(null);
  };

  const prefillData: Partial<Expense> | undefined = extracted
    ? {
        amount: extracted.amount ?? undefined,
        category: extracted.category ?? 'Other',
        date: extracted.date ? new Date(extracted.date).toISOString() : new Date().toISOString(),
        note: extracted.note ?? undefined,
      }
    : undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-white">AI Auto-Fill</h1>
          <span className="badge bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">Powered by Gemini</span>
        </div>
        <p className="text-slate-400 text-sm">
          Paste a bill, SMS, or receipt — AI extracts the amount, category, and date automatically.
        </p>
      </div>

      {/* Input Card */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Wand2 className="w-4 h-4 text-indigo-400" />
          <label className="text-sm font-medium text-slate-300">Paste your text</label>
        </div>
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="input-field min-h-[140px] resize-none leading-relaxed"
          placeholder="e.g. Paid $45.99 at Whole Foods grocery store on January 15th..."
          maxLength={2000}
          disabled={loading}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">{inputText.length}/2000</span>
          <div className="flex gap-2">
            {(extracted || error || inputText) && (
              <button onClick={handleReset} className="btn-secondary text-sm flex items-center gap-1.5 py-2">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
            <button onClick={handleExtract} disabled={loading || !inputText.trim()}
              className="btn-primary text-sm flex items-center gap-2 py-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Extracting...
                </>
              ) : (
                <><Sparkles className="w-4 h-4" /> Extract with AI</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      {!extracted && !error && (
        <div>
          <p className="text-xs text-slate-500 mb-2 font-medium">Try an example:</p>
          <div className="flex flex-col gap-2">
            {EXAMPLE_TEXTS.map((ex, i) => (
              <button key={i} onClick={() => setInputText(ex)}
                className="text-left text-xs text-slate-400 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 rounded-xl px-4 py-3 transition-all">
                <Send className="w-3 h-3 inline mr-2 text-indigo-400" />
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="glass-card p-5 border-red-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300 mb-1">Extraction Failed</p>
              <p className="text-xs text-slate-400">{error}</p>
              <button onClick={() => setModalOpen(true)}
                className="btn-secondary text-xs mt-3 py-1.5 px-3">
                Fill manually instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Result */}
      {extracted && (
        <div className="glass-card p-6 border-green-500/20 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-semibold text-green-300">Extraction Successful</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/60 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Amount</p>
              <p className="text-xl font-bold text-white">
                {extracted.amount != null ? `$${extracted.amount.toFixed(2)}` : '—'}
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Category</p>
              <p className="text-xl font-bold text-white">{extracted.category || '—'}</p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Date</p>
              <p className="text-base font-semibold text-white">
                {extracted.date
                  ? new Date(extracted.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'}
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Note</p>
              <p className="text-base font-semibold text-white truncate">{extracted.note || '—'}</p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            ✨ Review the details below before saving. You can edit them in the form.
          </p>

          <button onClick={() => setModalOpen(true)}
            className="btn-primary w-full flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> Review & Save Expense
          </button>
        </div>
      )}

      {/* Modal */}
      <ExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        prefill={prefillData}
        onSave={async (payload) => {
          const ok = await createExpense(payload as Omit<Expense, '_id' | 'userId' | 'createdAt' | 'updatedAt'>);
          if (ok) {
            setModalOpen(false);
            handleReset();
            toast.success('Expense saved!');
          }
        }}
      />
    </div>
  );
}
