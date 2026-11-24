import { Analytics } from '@vercel/analytics/react';
import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useProgress } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { UnitPage } from './pages/UnitPage';
import { AllQuestionsPage } from './pages/AllQuestionsPage';
import { RevisionPage } from './pages/RevisionPage';
import { WelcomeScreen } from './pages/WelcomeScreen';
import rawSyllabus from './data/syllabus.json';
import type { UnitMeta } from './types';
import { BookOpen, Search, X, Layers, Landmark } from 'lucide-react';

export const App: React.FC = () => {
  const { student, loading } = useAuth();
  const { summary } = useProgress();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const units = rawSyllabus as unknown as UnitMeta[];

  // Keyboard shortcut Ctrl + K for quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto animate-pulse shadow-lg shadow-blue-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">
            Loading DSA Prep Hub...
          </span>
        </div>
      </div>
    );
  }

  // If no student session is active, render the minimal Welcome Screen
  if (!student) {
    return <WelcomeScreen />;
  }

  // Selected Unit helper
  const selectedUnit = activeTab.startsWith('unit-')
    ? units.find(u => `unit-${u.id}` === activeTab)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onSelectUnit={(unitId) => setActiveTab(`unit-${unitId}`)}
            onOpenAllQuestions={() => setActiveTab('all-questions')}
            onOpenRevision={() => setActiveTab('bookmarks')}
          />
        )}

        {selectedUnit && (
          <UnitPage
            unit={selectedUnit}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'all-questions' && <AllQuestionsPage />}

        {activeTab === 'bookmarks' && <RevisionPage />}
      </main>

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                placeholder="Jump to topic, algorithm (e.g. Radix Sort, TBST, Prim, AVL)..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 sm:p-4 space-y-2 overflow-y-auto">
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 px-1 py-1">
                Quick Unit Navigation
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {units.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setActiveTab(`unit-${u.id}`);
                      setSearchModalOpen(false);
                    }}
                    className="p-2 sm:p-2.5 rounded-xl text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors border border-slate-200 dark:border-slate-700/60 min-h-[44px]"
                  >
                    <span className="block text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      UNIT {u.id}
                    </span>
                    <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {u.shortTitle}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    setActiveTab('all-questions');
                    setSearchModalOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Search className="w-4 h-4" /> Open Full Question Bank with Multi-Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Neutral General-Purpose Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              DSA PREP HUB – Data Structures & Algorithms Study Platform
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Universal University Syllabus</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-blue-500 transition-colors"
            >
              Dashboard
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('all-questions')}
              className="hover:text-blue-500 transition-colors"
            >
              Question Bank
            </button>
          </div>
        </div>
      </footer>
      <Analytics />
    </div>
  );
};
