import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionModal from '../components/transactions/TransactionModal';
import DeleteConfirmModal from '../components/transactions/DeleteConfirmModal';
import { TableSkeleton } from '../components/common/Skeleton';
import { transactionsApi } from '../api/client';
import { useToast } from '../components/common/Toast';
import { Plus, Download, RefreshCw } from 'lucide-react';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deletingTx, setDeletingTx] = useState(null);

  const toast = useToast();

  const fetchTransactions = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(filters.search ? { search: filters.search } : {}),
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.startDate ? { startDate: filters.startDate } : {}),
        ...(filters.endDate ? { endDate: filters.endDate } : {}),
      };

      const res = await transactionsApi.getAll(params);
      if (res?.success) {
        setTransactions(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      toast.error('Failed to load transactions: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleEdit = (tx) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const handleDelete = (tx) => {
    setDeletingTx(tx);
  };

  const handleAddNew = () => {
    setEditingTx(null);
    setIsModalOpen(true);
  };

  // Export current list to CSV
  const handleExportCSV = () => {
    if (!transactions.length) {
      toast.info('No transactions to export.');
      return;
    }
    const headers = ['Date', 'Type', 'Amount (INR)', 'Category', 'Description'];
    const rows = transactions.map((t) => [
      t.transaction_date,
      t.type,
      t.amount,
      `"${t.category}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ExpenseFlow_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Transactions exported to CSV!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Transactions" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Transactions
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage, search, and audit your financial records.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchTransactions(pagination.page)}
                disabled={loading}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
                title="Refresh list"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors"
                title="Export transactions to CSV"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <button
                onClick={handleAddNew}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <TransactionFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />

          {/* Table or Skeletons */}
          {loading && transactions.length === 0 ? (
            <TableSkeleton rows={8} />
          ) : (
            <TransactionTable
              transactions={transactions}
              pagination={pagination}
              onPageChange={(newPage) => fetchTransactions(newPage)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddNew={handleAddNew}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTx(null);
        }}
        initialData={editingTx}
        onSuccess={() => fetchTransactions(pagination.page)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTx)}
        onClose={() => setDeletingTx(null)}
        transaction={deletingTx}
        onSuccess={() => fetchTransactions(pagination.page)}
      />
    </div>
  );
};

export default TransactionsPage;
