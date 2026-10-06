import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
    </div>
    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-36 mb-2"></div>
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
  </div>
);

export const ChartSkeleton = ({ height = 'h-80' }) => (
  <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse ${height} flex flex-col justify-between`}>
    <div className="flex items-center justify-between mb-6">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
    </div>
    <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl flex items-end p-4 gap-4">
      <div className="h-2/5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
      <div className="h-4/5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
      <div className="h-3/5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
      <div className="h-5/6 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
      <div className="h-1/2 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
    </div>
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
            </div>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
        </div>
      ))}
    </div>
  </div>
);

export const BudgetSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-36"></div>
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div>
    </div>
    <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded w-44"></div>
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-full"></div>
    <div className="flex justify-between">
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
    </div>
  </div>
);
