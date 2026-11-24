import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import {
  BookOpen,
  LayoutDashboard,
  Layers,
  Bookmark,
  Users,
  Menu,
  X,
  Search,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
}) => {
  const { profile, switchStudent } = useAuth();
  const { summary, bookmarkedIds } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'unit-1', label: 'Unit I', icon: Layers },
    { id: 'unit-2', label: 'Unit II', icon: Layers },
    { id: 'unit-3', label: 'Unit III', icon: Layers },
    { id: 'unit-4', label: 'Unit IV', icon: Layers },
    { id: 'unit-5', label: 'Unit V', icon: Layers },
    { id: 'all-questions', label: 'All Questions', icon: BookOpen },
    {
      id: 'bookmarks',
      label: 'Revision',
      icon: Bookmark,
      badge: bookmarkedIds.size > 0 ? bookmarkedIds.size : undefined,
    },
  ];

  const unitItems = [
    { id: 'unit-1', num: 1, label: 'Unit I', title: 'Searching & Sorting' },
    { id: 'unit-2', num: 2, label: 'Unit II', title: 'Linked Lists' },
    { id: 'unit-3', num: 3, label: 'Unit III', title: 'Stacks & Queues' },
    { id: 'unit-4', num: 4, label: 'Unit IV', title: 'Trees & Heaps' },
    { id: 'unit-5', num: 5, label: 'Unit V', title: 'Graphs' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer flex-shrink min-w-0 select-none py-1"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate block">
                DSA PREP HUB
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium -mt-1 truncate">
                Data Structures & Algorithms Study Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Global Search (Ctrl + K)"
              aria-label="Open global search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <ThemeToggle />

            {/* Desktop Student Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs uppercase shadow-xs flex-shrink-0">
                {profile?.fullName ? profile.fullName.charAt(0) : 'S'}
              </div>
              <div className="text-left text-xs max-w-[110px] md:max-w-[140px]">
                <span className="block font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">
                  {profile?.fullName || 'Student'}
                </span>
                <span className="block text-[10px] text-slate-400">
                  Guest Session
                </span>
              </div>

              {/* Switch Student Action */}
              <button
                onClick={switchStudent}
                className="flex items-center gap-1 ml-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/80 min-h-[36px]"
                title="Switch Student"
              >
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden md:inline">Switch</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl px-3 sm:px-4 pt-3 pb-5 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Main Destination Tabs */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl text-xs font-bold transition-all min-h-[52px] ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavClick('all-questions')}
              className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl text-xs font-bold transition-all min-h-[52px] ${
                activeTab === 'all-questions'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="truncate">All Qs (67)</span>
            </button>

            <button
              onClick={() => handleNavClick('bookmarks')}
              className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl text-xs font-bold transition-all min-h-[52px] relative ${
                activeTab === 'bookmarks'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Revision</span>
              {bookmarkedIds.size > 0 && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-rose-500 text-white">
                  {bookmarkedIds.size}
                </span>
              )}
            </button>
          </div>

          {/* Unit Quick Access */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Syllabus Units
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {unitItems.map((unit) => {
                const isActive = activeTab === unit.id;
                const unitProgress = summary.unitProgress[unit.num];
                const percentage = unitProgress ? unitProgress.percentage : 0;
                return (
                  <button
                    key={unit.id}
                    onClick={() => handleNavClick(unit.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-left transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <span className="block text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate">
                        {unit.label}
                      </span>
                      <span className="block text-[10px] text-slate-400 truncate">
                        {unit.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/40 px-1.5 py-0.5 rounded-md flex-shrink-0">
                      {percentage}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Search Shortcut inside Drawer */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearch();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 min-h-[44px]"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search Questions & Topics...</span>
          </button>

          {/* Student Profile Card & Switch */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                {profile?.fullName ? profile.fullName.charAt(0) : 'S'}
              </div>
              <div className="text-left text-xs min-w-0">
                <span className="block font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {profile?.fullName || 'Student'}
                </span>
                <span className="block text-[10px] text-slate-400 truncate">
                  {summary.completedQuestions} of {summary.totalQuestions} Questions Done
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                switchStudent();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 min-h-[44px] flex-shrink-0"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Switch</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
