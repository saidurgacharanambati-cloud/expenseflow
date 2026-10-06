import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import MetricCard from '../components/dashboard/MetricCard';
import ExpensePieChart from '../components/dashboard/ExpensePieChart';
import IncomeExpenseBarChart from '../components/dashboard/IncomeExpenseBarChart';
import SpendingTrendChart from '../components/dashboard/SpendingTrendChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetProgress from '../components/budget/BudgetProgress';
import BudgetModal from '../components/budget/BudgetModal';
import TransactionModal from '../components/transactions/TransactionModal';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/common/Skeleton';
import { dashboardApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Plus,
  Calendar,
  RefreshCw,
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend';

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getSummary({
        month: selectedMonth,
        year: selectedYear,
      });
      if (res?.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      toast.error('Failed to load dashboard: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, toast]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Year choices (current year - 2 to current year + 1)
  const currentYear = now.getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Dashboard" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Row: Greeting & Period Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {getGreeting()}, {userName} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Here is your financial snapshot for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
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

              {/* Refresh button */}
              <button
                onClick={fetchDashboard}
                disabled={loading}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
                title="Refresh dashboard data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {/* Add Transaction Primary CTA */}
              <button
                onClick={() => setIsTxModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          {loading && !dashboardData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <MetricCard
                title="Total Balance"
                amount={dashboardData?.summary?.totalBalance || 0}
                icon={Wallet}
                colorScheme="brand"
                subtitle="All-time accumulated net balance"
              />
              <MetricCard
                title="Total Income"
                amount={dashboardData?.summary?.monthIncome || 0}
                icon={ArrowUpRight}
                colorScheme="income"
                subtitle={`Earnings in ${MONTH_NAMES[selectedMonth - 1]}`}
              />
              <MetricCard
                title="Total Expenses"
                amount={dashboardData?.summary?.monthExpense || 0}
                icon={ArrowDownRight}
                colorScheme="expense"
                subtitle={`Spending in ${MONTH_NAMES[selectedMonth - 1]}`}
              />
              <MetricCard
                title="Net Savings"
                amount={dashboardData?.summary?.monthSavings || 0}
                icon={PiggyBank}
                colorScheme="savings"
                subtitle="Income minus monthly expenses"
              />
            </div>
          )}

          {/* Budget Widget & Spending Trend Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <BudgetProgress
                budgetData={dashboardData?.summary?.budget}
                onConfigureClick={() => setIsBudgetModalOpen(true)}
              />
            </div>
            <div className="lg:col-span-2">
              {loading && !dashboardData ? (
                <ChartSkeleton height="h-72" />
              ) : (
                <SpendingTrendChart data={dashboardData?.charts?.spendingTrend || []} />
              )}
            </div>
          </div>

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading && !dashboardData ? (
              <>
                <ChartSkeleton height="h-80" />
                <ChartSkeleton height="h-80" />
              </>
            ) : (
              <>
                <ExpensePieChart data={dashboardData?.charts?.categoryBreakdown || []} />
                <IncomeExpenseBarChart data={dashboardData?.charts?.incomeVsExpense || []} />
              </>
            )}
          </div>

          {/* Recent Transactions List */}
          <div>
            {loading && !dashboardData ? (
              <TableSkeleton rows={5} />
            ) : (
              <RecentTransactions
                transactions={dashboardData?.recentTransactions || []}
                onAddClick={() => setIsTxModalOpen(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Transaction & Budget Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSuccess={fetchDashboard}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        existingBudget={dashboardData?.summary?.budget?.configured ? dashboardData.summary.budget : null}
        onSaveSuccess={fetchDashboard}
      />
    </div>
  );
};

export default DashboardPage;
