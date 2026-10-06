import { supabaseAdmin } from '../config/supabase.js';

export const getCurrentBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    // 1. Fetch budget for this month/year
    const { data: budgetData, error: budgetError } = await supabaseAdmin
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
      .maybeSingle();

    if (budgetError) {
      return res.status(400).json({ success: false, message: budgetError.message });
    }

    // 2. Calculate expenses for this month/year
    // First day of month to last day of month
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const { data: expenseTransactions, error: expenseError } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('transaction_date', startOfMonth)
      .lte('transaction_date', endOfMonth);

    if (expenseError) {
      return res.status(400).json({ success: false, message: expenseError.message });
    }

    const totalSpent = (expenseTransactions || []).reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    const budgetAmount = budgetData ? parseFloat(budgetData.amount) : 0;
    const remaining = budgetAmount > 0 ? budgetAmount - totalSpent : 0;
    const percentage = budgetAmount > 0 ? (totalSpent / budgetAmount) * 100 : 0;

    let status = 'normal';
    if (percentage > 100) {
      status = 'exceeded';
    } else if (percentage >= 75) {
      status = 'warning';
    }

    return res.status(200).json({
      success: true,
      data: {
        budget: budgetData || null,
        month,
        year,
        budgetAmount,
        totalSpent: Number(totalSpent.toFixed(2)),
        remaining: Number(remaining.toFixed(2)),
        percentageUsed: Number(percentage.toFixed(1)),
        status,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { month, year, amount } = req.body;

    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);
    const parsedAmount = parseFloat(amount);

    if (!parsedMonth || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({
        success: false,
        message: 'Valid month between 1 and 12 is required.',
      });
    }

    if (!parsedYear || parsedYear < 2000) {
      return res.status(400).json({
        success: false,
        message: 'Valid year (2000 or later) is required.',
      });
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget amount must be a positive number greater than 0.',
      });
    }

    // Upsert budget on conflict (user_id, month, year)
    const { data, error } = await supabaseAdmin
      .from('budgets')
      .upsert(
        {
          user_id: userId,
          month: parsedMonth,
          year: parsedYear,
          amount: parsedAmount,
        },
        { onConflict: 'user_id,month,year' }
      )
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Monthly budget configured successfully.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { amount } = req.body;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget amount must be greater than 0.',
      });
    }

    const { data, error } = await supabaseAdmin
      .from('budgets')
      .update({ amount: parsedAmount })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized to update.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Budget updated successfully.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Budget deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
