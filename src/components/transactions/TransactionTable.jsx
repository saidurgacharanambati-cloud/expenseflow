import React from 'react';
import {
  Edit2,
  Trash2,
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
  ChevronLeft,
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

const TransactionTable = ({
  transactions = [],
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const { page = 1, limit = 10, total = 0, totalPages = 1 } = pagination || {};

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <Inbox className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          No transactions found
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
          Try adjusting your filter search criteria or record a new transaction to begin tracking your finances.
        </p>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all"
          >
            + Add Transaction
          </button>
        )}
      </div>
    );
  }

  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(total, page * limit);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-6">Date</th>
              <th className="py-3.5 px-6">Description</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6">Type</th>
              <th className="py-3.5 px-6 text-right">Amount</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {transactions.map((tx) => {
              const Icon = CATEGORY_ICONS[tx.category] || CircleDollarSign;
              const isIncome = tx.type === 'income';
              const formattedAmount = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(tx.amount);

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                    {tx.transaction_date}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                    {tx.description || tx.category}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{tx.category}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isIncome
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <span
                      className={`font-bold text-sm ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(tx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
        {transactions.map((tx) => {
          const Icon = CATEGORY_ICONS[tx.category] || CircleDollarSign;
          const isIncome = tx.type === 'income';
          const formattedAmount = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(tx.amount);

          return (
            <div key={tx.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {tx.description || tx.category}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{tx.transaction_date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-bold block ${
                      isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {tx.type}
                  </span>
                </div>
              </div>

              {/* Actions row on mobile */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  onClick={() => onEdit(tx)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDelete(tx)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
        <span className="text-slate-500">
          Showing <span className="font-semibold text-slate-900 dark:text-white">{startIdx}</span> to{' '}
          <span className="font-semibold text-slate-900 dark:text-white">{endIdx}</span> of{' '}
          <span className="font-semibold text-slate-900 dark:text-white">{total}</span> entries
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          <span className="px-2 font-semibold text-slate-700 dark:text-slate-300">
            {page} / {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
