import type { Expense, ExpenseCategory } from '@/types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/types';

interface Props {
  expense: Expense;
}

export function RecentExpenseRow({ expense }: Props) {
  const color = CATEGORY_COLORS[expense.category as ExpenseCategory] || '#6366f1';
  const icon = CATEGORY_ICONS[expense.category as ExpenseCategory] || '📦';
  const date = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-700/30 transition-colors">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
        style={{ backgroundColor: `${color}22` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">
          {expense.note || expense.category}
        </p>
        <p className="text-xs text-slate-500">{date} · {expense.category}</p>
      </div>
      <p className="text-sm font-bold text-slate-100 flex-shrink-0">
        ${expense.amount.toFixed(2)}
      </p>
    </div>
  );
}
