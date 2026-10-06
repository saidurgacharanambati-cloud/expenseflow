import { supabaseAdmin } from '../config/supabase.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    // 1. Date range for the selected month
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;

    // 2. Fetch all transactions for selected month
    const { data: monthTransactions, error: monthTxError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('transaction_date', startOfMonth)
      .lte('transaction_date', endOfMonth)
      .order('transaction_date', { ascending: true });

    if (monthTxError) {
      return res.status(400).json({ success: false, message: monthTxError.message });
    }

    // 3. Fetch all-time balance sums
    const { data: allTimeTransactions, error: allTimeError } = await supabaseAdmin
      .from('transactions')
      .select('type, amount')
      .eq('user_id', userId);

    if (allTimeError) {
      return res.status(400).json({ success: false, message: allTimeError.message });
    }

    const allTimeIncome = (allTimeTransactions || [])
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    const allTimeExpense = (allTimeTransactions || [])
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    const totalBalance = allTimeIncome - allTimeExpense;

    // 4. Calculate month metrics
    let monthIncome = 0;
    let monthExpense = 0;
    const categoryTotals = {};
    const dailySpendingMap = {};

    // Initialize daily map for the whole month
    for (let day = 1; day <= lastDayOfMonth; day++) {
      const dayKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailySpendingMap[dayKey] = 0;
    }

    (monthTransactions || []).forEach((t) => {
      const amt = parseFloat(t.amount || 0);
      if (t.type === 'income') {
        monthIncome += amt;
      } else if (t.type === 'expense') {
        monthExpense += amt;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
        if (dailySpendingMap[t.transaction_date] !== undefined) {
          dailySpendingMap[t.transaction_date] += amt;
        }
      }
    });

    const monthSavings = monthIncome - monthExpense;

    // Format Expense by Category for Donut Chart
    const categoryBreakdown = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
      percentage: monthExpense > 0 ? Number(((value / monthExpense) * 100).toFixed(1)) : 0,
    })).sort((a, b) => b.value - a.value);

    // Format Spending Trend for Line Chart
    const spendingTrend = Object.entries(dailySpendingMap).map(([dateStr, amount]) => {
      const dayNumber = parseInt(dateStr.split('-')[2], 10);
      return {
        date: dateStr,
        day: `Day ${dayNumber}`,
        amount: Number(amount.toFixed(2)),
      };
    });

    // 5. Fetch 6 Months History for Bar Chart (Income vs Expense)
    const sixMonthsAgo = new Date(year, month - 6, 1);
    const startOfSixMonths = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}-01`;

    const { data: sixMonthsData, error: sixMonthsError } = await supabaseAdmin
      .from('transactions')
      .select('type, amount, transaction_date')
      .eq('user_id', userId)
      .gte('transaction_date', startOfSixMonths)
      .lte('transaction_date', endOfMonth);

    const monthlyHistoryMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear() % 100}`;
      monthlyHistoryMap[key] = { label, income: 0, expense: 0 };
    }

    (sixMonthsData || []).forEach((t) => {
      const key = t.transaction_date.substring(0, 7);
      if (monthlyHistoryMap[key]) {
        const amt = parseFloat(t.amount || 0);
        if (t.type === 'income') {
          monthlyHistoryMap[key].income += amt;
        } else {
          monthlyHistoryMap[key].expense += amt;
        }
      }
    });

    const incomeVsExpense = Object.values(monthlyHistoryMap).map((m) => ({
      name: m.label,
      income: Number(m.income.toFixed(2)),
      expense: Number(m.expense.toFixed(2)),
    }));

    // 6. Fetch Recent 8 Transactions
    const { data: recentTransactions, error: recentError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8);

    // 7. Fetch Budget for Selected Month
    const { data: budgetData } = await supabaseAdmin
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
      .maybeSingle();

    const budgetAmount = budgetData ? parseFloat(budgetData.amount) : 0;
    const budgetRemaining = budgetAmount > 0 ? budgetAmount - monthExpense : 0;
    const budgetPercentage = budgetAmount > 0 ? (monthExpense / budgetAmount) * 100 : 0;

    let budgetStatus = 'normal';
    if (budgetPercentage > 100) budgetStatus = 'exceeded';
    else if (budgetPercentage >= 75) budgetStatus = 'warning';

    return res.status(200).json({
      success: true,
      data: {
        selectedPeriod: { month, year },
        summary: {
          totalBalance: Number(totalBalance.toFixed(2)),
          monthIncome: Number(monthIncome.toFixed(2)),
          monthExpense: Number(monthExpense.toFixed(2)),
          monthSavings: Number(monthSavings.toFixed(2)),
          budget: {
            configured: !!budgetData,
            amount: budgetAmount,
            spent: Number(monthExpense.toFixed(2)),
            remaining: Number(budgetRemaining.toFixed(2)),
            percentage: Number(budgetPercentage.toFixed(1)),
            status: budgetStatus,
          },
        },
        charts: {
          categoryBreakdown,
          incomeVsExpense,
          spendingTrend,
        },
        recentTransactions: recentTransactions || [],
      },
    });
  } catch (err) {
    next(err);
  }
};
