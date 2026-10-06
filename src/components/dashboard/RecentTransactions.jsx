import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowDownRight,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Tv,
  HeartPulse,
  GraduationCap,
  Plane,
  Briefcase,
  Laptop,
  TrendingUp,
  CircleDollarSign,
  ChevronRight,
  Inbox,
} from 'lucide-react';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: Tv,
  Health: HeartPulse,
  Education: GraduationCap,
  Travel: Plane,
  Salary: Briefcase,
  Freelance: Laptop,
  Business: TrendingUp,
  Investment: CircleDollarSign,
  Other: CircleDollarSign,
  'Other Income': CircleDollarSign,
};

const RecentTransactions = ({ transactions = [], onAddClick }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Your latest recorded financial entries</p>
        </div>
        <Link
          to="/transactions"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 group"
        >
          <span>View all</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[220px]">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No transactions yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mb-4">
            Start tracking your money by adding your first income or expense transaction.
          </p>
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all"
            >
              + Add Transaction
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-y-auto max-h-[360px] -mx-2 px-2">
          {transactions.map((t) => {
            const Icon = CATEGORY_ICONS[t.category] || CircleDollarSign;
            const isIncome = t.type === 'income';
            const formattedAmount = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(t.amount);

            const formattedDate = new Date(t.transaction_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={t.id}
                className="flex items-center justify-between py-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {t.description || t.category}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <span>{t.category}</span>
                      <span>•</span>
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-3 text-right">
                  {isIncome ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                  <span
                    className={`text-sm font-bold ${
                      isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
