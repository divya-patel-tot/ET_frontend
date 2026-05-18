'use client';

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { CATEGORY_COLORS } from '@/types';
import type { ExpenseCategory } from '@/types';

interface Props {
  data: { category: string; total: number }[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="font-semibold text-slate-200">{payload[0].name}</p>
        <p className="text-indigo-400 font-bold">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export function SpendingDonutChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-56 flex items-center justify-center">
        <p className="text-slate-500 text-sm">No data for this month</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="total"
          nameKey="category"
        >
          {data.map((entry) => (
            <Cell
              key={entry.category}
              fill={CATEGORY_COLORS[entry.category as ExpenseCategory] || '#6366f1'}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
