import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/common/Toast';
import {
  Moon,
  Sun,
  Shield,
  LogOut,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.info('You have logged out.');
      navigate('/login');
    } catch (err) {
      toast.error('Logout error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Settings" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Application Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your interface theme and session settings.
            </p>
          </div>

          <div className="space-y-6">
            {/* Appearance Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Appearance & Theme
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch between Light and Dark display modes across all screens and financial charts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-md mt-4">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                    theme === 'light'
                      ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                  {theme === 'light' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 ml-auto" />}
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                    theme === 'dark'
                      ? 'border-brand-500 bg-slate-800 text-white ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-4 h-4 text-brand-400" />
                  <span>Dark Mode</span>
                  {theme === 'dark' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 ml-auto" />}
                </button>
              </div>
            </div>

            {/* Account Information Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Account & Security
                  </h3>
                  <p className="text-xs text-slate-400">
                    Your authenticated credentials and data isolation status.
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-w-md text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Current User:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.email}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Database Protection:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Row Level Security Active
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Authentication Provider:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Supabase PostgreSQL
                  </span>
                </div>
              </div>
            </div>

            {/* Session Actions Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-rose-700 dark:text-rose-400">
                  Sign Out
                </h3>
                <p className="text-xs text-slate-400">
                  Terminate your active session on this device.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of ExpenseFlow</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
