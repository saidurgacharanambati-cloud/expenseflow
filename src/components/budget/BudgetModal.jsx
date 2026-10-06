import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Loader2 } from 'lucide-react';
import { budgetsApi } from '../../api/client';
import { useToast } from '../common/Toast';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BudgetModal = ({ isOpen, onClose, selectedMonth, selectedYear, existingBudget, onSaveSuccess }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (existingBudget?.amount) {
      setAmount(existingBudget.amount.toString());
    } else {
      setAmount('');
    }
    setError('');
  }, [existingBudget, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid budget amount greater than 0.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await budgetsApi.createOrUpdate({
        month: selectedMonth,
        year: selectedYear,
        amount: parsedAmount,
      });

      toast.success(`Budget for ${MONTH_NAMES[selectedMonth - 1]} updated successfully!`);
      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save budget.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingBudget?.id) return;
    if (!window.confirm(`Are you sure you want to remove the budget for ${MONTH_NAMES[selectedMonth - 1]}?`)) return;

    try {
      setLoading(true);
      await budgetsApi.delete(existingBudget.id);
      toast.success('Budget removed successfully.');
      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete budget.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingBudget ? `Edit Budget (${MONTH_NAMES[selectedMonth - 1]} ${selectedYear})` : `Set Budget (${MONTH_NAMES[selectedMonth - 1]} ${selectedYear})`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Monthly Target Spending Limit (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              step="any"
              min="1"
              required
              placeholder="e.g. 25000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Total expenses in {MONTH_NAMES[selectedMonth - 1]} will be tracked against this limit.
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {existingBudget?.id ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
            >
              Remove
            </button>
          ) : <span />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Budget</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetModal;
