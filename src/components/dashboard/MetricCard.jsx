import React from 'react';

const MetricCard = ({ title, amount, icon: Icon, trend, colorScheme = 'brand', subtitle }) => {
  const schemeStyles = {
    brand: {
      badgeBg: 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400',
      valueColor: 'text-slate-900 dark:text-white',
      borderHover: 'hover:border-brand-200 dark:hover:border-brand-800',
    },
    income: {
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
      borderHover: 'hover:border-emerald-200 dark:hover:border-emerald-800',
    },
    expense: {
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
      valueColor: 'text-rose-600 dark:text-rose-400',
      borderHover: 'hover:border-rose-200 dark:hover:border-rose-800',
    },
    savings: {
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
      valueColor: amount >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400',
      borderHover: 'hover:border-indigo-200 dark:hover:border-indigo-800',
    },
  }[colorScheme] || schemeStyles.brand;

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount || 0);

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 ${schemeStyles.borderHover}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${schemeStyles.badgeBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${schemeStyles.valueColor}`}>
          {formattedAmount}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
