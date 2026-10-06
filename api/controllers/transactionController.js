import { supabaseAdmin } from '../config/supabase.js';

export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
      search,
      sortBy = 'transaction_date',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    // Base query with user isolation
    let query = supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Filter by type
    if (type && ['income', 'expense'].includes(type)) {
      query = query.eq('type', type);
    }

    // Filter by category
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    // Filter by date range
    if (startDate) {
      query = query.gte('transaction_date', startDate);
    }
    if (endDate) {
      query = query.lte('transaction_date', endDate);
    }

    // Search query on description or category
    if (search && search.trim()) {
      const term = search.trim();
      query = query.or(`description.ilike.%${term}%,category.ilike.%${term}%`);
    }

    // Sorting
    const validSortCols = ['transaction_date', 'amount', 'category', 'created_at'];
    const sortCol = validSortCols.includes(sortBy) ? sortBy : 'transaction_date';
    const isAscending = sortOrder.toLowerCase() === 'asc';

    query = query
      .order(sortCol, { ascending: isAscending })
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data, count, error } = await query;

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      data: data || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, amount, category, description, transaction_date } = req.body;

    // Strict validation
    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction type. Must be 'income' or 'expense'.",
      });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number greater than 0.',
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category is required.',
      });
    }

    if (!transaction_date || isNaN(Date.parse(transaction_date))) {
      return res.status(400).json({
        success: false,
        message: 'A valid transaction date is required (YYYY-MM-DD).',
      });
    }

    const newRecord = {
      user_id: userId, // Enforce authenticated user ID
      type,
      amount: numericAmount,
      category: category.trim(),
      description: description ? description.trim() : '',
      transaction_date,
    };

    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert([newRecord])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { type, amount, category, description, transaction_date } = req.body;

    // Verify record exists and belongs to user
    const { data: existing, error: findError } = await supabaseAdmin
      .from('transactions')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (findError || !existing) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or you do not have permission to edit it.',
      });
    }

    const updates = {};

    if (type !== undefined) {
      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ success: false, message: "Type must be 'income' or 'expense'." });
      }
      updates.type = type;
    }

    if (amount !== undefined) {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be greater than 0.' });
      }
      updates.amount = numericAmount;
    }

    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({ success: false, message: 'Category cannot be empty.' });
      }
      updates.category = category.trim();
    }

    if (description !== undefined) {
      updates.description = description.trim();
    }

    if (transaction_date !== undefined) {
      if (isNaN(Date.parse(transaction_date))) {
        return res.status(400).json({ success: false, message: 'Invalid transaction date format.' });
      }
      updates.transaction_date = transaction_date;
    }

    const { data, error } = await supabaseAdmin
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check existence and ownership
    const { data: existing, error: findError } = await supabaseAdmin
      .from('transactions')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (findError || !existing) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized to delete.',
      });
    }

    const { error } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
