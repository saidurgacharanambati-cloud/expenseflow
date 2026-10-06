import React, { useState } from 'react';
import Modal from '../common/Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { transactionsApi } from '../../api/client';
import { useToast } from '../common/Toast';

const DeleteConfirmModal = ({ isOpen, onClose, transaction, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!transaction) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await transactionsApi.delete(transaction.id);
      toast.success('Transaction deleted successfully.');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to delete transaction.');
    } finally {
      setLoading(false);
    }
  };

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(transaction.amount);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Transaction">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-800 dark:text-rose-300">
            <p className="font-semibold text-sm mb-1">Are you sure you want to delete this transaction?</p>
            <p>This action cannot be undone. It will permanently remove this entry and recalculate your balances.</p>
          </div>
        </div>

        {/* Transaction Summary Card */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Description:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {transaction.description || transaction.category}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Category & Type:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {transaction.category} ({transaction.type})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Amount:</span>
            <span
              className={`font-bold ${
                transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {transaction.type === 'income' ? `+${formattedAmount}` : `-${formattedAmount}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Date:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {transaction.transaction_date}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
