import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CATEGORY_COLORS = [
  '#4f46e5', // Brand Indigo
  '#f43f5e', // Rose
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#64748b', // Slate
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(data.value);

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{data.name}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{formatted}</p>
        <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">{data.percentage}% of expenses</p>
      </div>
    );
  }
  return null;
};

const ExpensePieChart = ({ data = [] }) => {
  const { theme } = useTheme();
  const hasData = data && data.length > 0 && data.some((item) => item.value > 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Expense by Category</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Distribution for selected period</p>
        </div>
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[260px]">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <PieIcon className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No expense data available</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Add your expenses for this month to visualize where your money goes.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/2 h-56 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      stroke={theme === 'dark' ? '#0f172a' : '#ffffff'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Legend list */}
          <div className="w-full sm:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-1">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-900 dark:text-white font-semibold">
                    ₹{item.value.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-400 text-[11px] w-10 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensePieChart;
