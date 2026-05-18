'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Receipt, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import type { DashboardSummary, ExpenseCategory } from '@/types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/types';
import { SpendingDonutChart } from '@/components/charts/SpendingDonutChart';
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart';
import { RecentExpenseRow } from '@/components/dashboard/RecentExpenseRow';

const SkeletonCard = () => (
  <div className="stat-card">
    <div className="skeleton h-4 w-24 mb-3 rounded" />
    <div className="skeleton h-8 w-32 rounded" />
    <div className="skeleton h-3 w-20 mt-1 rounded" />
  </div>
);

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardSummary>('/api/dashboard/summary')
      .then(({ data }) => setSummary(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const topCategory = summary?.byCategory[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">{monthLabel} overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">This Month</span>
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                ${(summary?.totalThisMonth ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500 mt-1">Total spending</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Transactions</span>
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{summary?.recentExpenses.length ?? 0}</p>
              <p className="text-xs text-slate-500 mt-1">Recent entries</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Top Category</span>
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {topCategory ? `${CATEGORY_ICONS[topCategory.category as ExpenseCategory]} ${topCategory.category}` : '—'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {topCategory ? `$${topCategory.total.toFixed(2)} spent` : 'No data yet'}
              </p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Categories</span>
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{summary?.byCategory.length ?? 0}</p>
              <p className="text-xs text-slate-500 mt-1">Active this month</p>
            </div>
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 glass-card p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Spending by Category</h2>
          {loading ? (
            <div className="skeleton h-56 rounded-xl" />
          ) : (
            <SpendingDonutChart data={summary?.byCategory ?? []} />
          )}
        </div>

        <div className="xl:col-span-3 glass-card p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Monthly Trend (Last 6 Months)</h2>
          {loading ? (
            <div className="skeleton h-56 rounded-xl" />
          ) : (
            <MonthlyTrendChart data={summary?.monthlyTrend ?? []} />
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      {!loading && summary && summary.byCategory.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Category Breakdown</h2>
          <div className="space-y-3">
            {summary.byCategory.map(({ category, total }) => {
              const pct = summary.totalThisMonth > 0 ? (total / summary.totalThisMonth) * 100 : 0;
              const color = CATEGORY_COLORS[category as ExpenseCategory] || '#6366f1';
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">
                      {CATEGORY_ICONS[category as ExpenseCategory]} {category}
                    </span>
                    <span className="text-sm font-semibold text-slate-200">${total.toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300">Recent Expenses</h2>
          <Link href="/expenses"
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="skeleton w-9 h-9 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3.5 w-28 rounded" />
                  <div className="skeleton h-3 w-20 rounded" />
                </div>
                <div className="skeleton h-4 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : summary?.recentExpenses.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No expenses yet. <Link href="/expenses" className="text-indigo-400 hover:text-indigo-300">Add your first one →</Link></p>
        ) : (
          <div className="space-y-1">
            {summary?.recentExpenses.map((exp) => (
              <RecentExpenseRow key={exp._id} expense={exp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
