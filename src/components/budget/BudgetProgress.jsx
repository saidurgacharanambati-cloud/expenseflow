import React from 'react';
import { AlertTriangle, CheckCircle, AlertOctagon, TrendingUp } from 'lucide-react';

const BudgetProgress = ({ budgetData, onConfigureClick }) => {
  const {
    configured = false,
    amount = 0,
    spent = 0,
    remaining = 0,
    percentage = 0,
    status = 'normal',
  } = budgetData || {};

  const formattedBudget = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

  const formattedSpent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(spent);

  const formattedRemaining = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Math.max(0, remaining));

  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  // Determine status color styling
  let colorConfig = {
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle,
    label: 'On Track',
    message: `You've used ${percentage.toFixed(1)}% of your monthly budget.`,
  };

  if (status === 'warning') {
    colorConfig = {
      barColor: 'bg-amber-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: AlertTriangle,
      label: 'Warning',
      message: `You've used ${percentage.toFixed(1)}% of your monthly budget. Watch your spending.`,
    };
  } else if (status === 'exceeded') {
    colorConfig = {
      barColor: 'bg-rose-500',
      textColor: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      icon: AlertOctagon,
      label: 'Exceeded',
      message: `Budget exceeded by ₹${Math.abs(remaining).toLocaleString('en-IN')}!`,
    };
  }

  const StatusIcon = colorConfig.icon;

  if (!configured) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Budget</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Plan and control your expenses</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="py-4 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            No budget set for this month
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Setting a monthly spending target helps prevent overspending and increases your savings rate.
          </p>
          <button
            onClick={onConfigureClick}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all"
          >
            Set Monthly Budget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Budget</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Spending limits & health</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorConfig.badgeBg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{colorConfig.label}</span>
          </div>
        </div>

        {/* Big numbers */}
        <div className="flex items-baseline justify-between mt-4 mb-2">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Spent</span>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {formattedSpent}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase font-semibold">Budget</span>
            <p className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-300">
              {formattedBudget}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden mt-3 mb-2">
          <div
            className={`h-full transition-all duration-500 rounded-full ${colorConfig.barColor}`}
            style={{ width: `${clampedPercentage}%` }}
          />
        </div>

        {/* Message and Remaining */}
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {colorConfig.message}
          </span>
          <span className={`font-semibold ${colorConfig.textColor}`}>
            {status === 'exceeded'
              ? `Exceeded by ₹${Math.abs(remaining).toLocaleString('en-IN')}`
              : `₹${remaining.toLocaleString('en-IN')} remaining`}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={onConfigureClick}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
        >
          Edit Budget Limit →
        </button>
      </div>
    </div>
  );
};

export default BudgetProgress;
