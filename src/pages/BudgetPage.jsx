import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import BudgetProgress from '../components/budget/BudgetProgress';
import BudgetModal from '../components/budget/BudgetModal';
import { BudgetSkeleton } from '../components/common/Skeleton';
import { budgetsApi } from '../api/client';
import { useToast } from '../components/common/Toast';
import {
  Calendar,
  PieChart,
  Plus,
  TrendingDown,
  ShieldAlert,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BudgetPage = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toast = useToast();

  const fetchBudget = useCallback(async () => {
    try {
      setLoading(true);
      const res = await budgetsApi.getCurrent({
        month: selectedMonth,
        year: selectedYear,
      });
      if (res?.success) {
        setBudgetData(res.data);
      }
    } catch (err) {
      toast.error('Failed to load budget: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, toast]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const currentYear = now.getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Monthly Budget" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Monthly Budget
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Configure your monthly spending target and monitor live expenditure.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Month & Year Selectors */}
              <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <Calendar className="w-4 h-4 text-slate-400 ml-2" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                  className="px-2 py-1.5 text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={m} value={idx + 1} className="dark:bg-slate-900">
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="px-2 py-1.5 text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y} className="dark:bg-slate-900">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={fetchBudget}
                disabled={loading}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
                title="Refresh budget"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{budgetData?.budget ? 'Edit Budget' : 'Set Budget'}</span>
              </button>
            </div>
          </div>

          {/* Main Budget Card */}
          {loading && !budgetData ? (
            <BudgetSkeleton />
          ) : (
            <BudgetProgress
              budgetData={{
                configured: !!budgetData?.budget,
                amount: budgetData?.budgetAmount || 0,
                spent: budgetData?.totalSpent || 0,
                remaining: budgetData?.remaining || 0,
                percentage: budgetData?.percentageUsed || 0,
                status: budgetData?.status || 'normal',
              }}
              onConfigureClick={() => setIsModalOpen(true)}
            />
          )}

          {/* Budget Guidelines & Best Practices Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-3 text-brand-600 dark:text-brand-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  The 50/30/20 Budgeting Rule
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                A proven personal finance framework: Allocate 50% of your earnings to essential Needs, 30% to Wants, and reserve 20% strictly for Savings and emergency funds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-3 text-amber-500">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Spending Threshold Alerts
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                When you cross 75% of your target limit, ExpenseFlow switches to a Warning state, alerting you before you exceed your total budget.
              </p>
            </div>
          </div>
        </main>
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        existingBudget={budgetData?.budget}
        onSaveSuccess={fetchBudget}
      />
    </div>
  );
};

export default BudgetPage;
