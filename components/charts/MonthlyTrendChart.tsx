'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface Props {
  data: { month: string; total: number }[];
}

const formatMonth = (month: string) => {
  const [year, mon] = month.split('-');
  const date = new Date(Number(year), Number(mon) - 1, 1);
  return date.toLocaleString('default', { month: 'short' });
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-indigo-400 font-bold">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export function MonthlyTrendChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-56 flex items-center justify-center">
        <p className="text-slate-500 text-sm">No trend data yet</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    month: formatMonth(d.month),
    total: d.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} barSize={24}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
        <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
