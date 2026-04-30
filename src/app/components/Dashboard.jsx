'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useResult } from '../context/ResultContext';

export default function Dashboard() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useResult();
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(
    typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark'),
  );

  const closeMobileMenu = () => {
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode((prev) => !prev);
  };

  return (
    <>
      {/* Close button for mobile */}
      {isMobileMenuOpen && (
        <div className="p-3 sm:p-4 flex items-center justify-between border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-primary p-1.5 sm:p-2 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl sm:text-2xl">
                hardware
              </span>
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight">
              Bolt<span className="text-primary">Calculator</span>
            </span>
          </div>
          <button
            type="button"
            className="material-icons-round text-slate-600 dark:text-slate-400 p-2 -mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            close
          </button>
        </div>
      )}

      <nav className="flex-1 px-2 sm:px-4 py-3 sm:py-4 space-y-0.5 sm:space-y-1 overflow-y-auto">
        <div className="text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 sm:px-3 mb-1.5 sm:mb-2">
          Navigation
        </div>
        <Link
          className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 transition-colors rounded-md"
          href="/home"
          onClick={closeMobileMenu}
        >
          <span className="material-icons-round text-lg sm:text-[20px]">
            home
          </span>
          Home
        </Link>
        <Link
          className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 transition-colors rounded-md"
          href="/about"
          onClick={closeMobileMenu}
        >
          <span className="material-symbols-outlined text-lg sm:text-[20px]">
            groups_3
          </span>
          About
        </Link>
        <Link
          className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-2 text-sm font-medium rounded-md transition-colors ${
            pathname === '/blogs' || pathname.startsWith('/blogs/')
              ? 'bg-primary/10 text-primary border-r-2 border-primary'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700'
          }`}
          href="/blogs"
          onClick={closeMobileMenu}
        >
          <span className="material-icons-round text-lg sm:text-[20px]">
            article
          </span>
          Blogs
        </Link>

        <div className="pt-3 sm:pt-4 text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 sm:px-3 mb-1.5 sm:mb-2">
          Calculators
        </div>
        <Link
          className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-2 text-sm font-medium rounded-md transition-colors ${
            pathname === '/input'
              ? 'bg-primary/10 text-primary border-r-2 border-primary'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700'
          }`}
          href="/input"
          onClick={closeMobileMenu}
        >
          <span className="material-icons-round text-lg sm:text-[20px]">
            bolt
          </span>
          Load Calculator
        </Link>
        <Link
          className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 transition-colors rounded-md"
          href="/coming_soon"
          onClick={closeMobileMenu}
        >
          <span className="material-icons-round text-lg sm:text-[20px]">
            architecture
          </span>
          Torque Specs
        </Link>
        <Link
          className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 sm:py-2 text-sm font-medium rounded-md transition-colors ${
            pathname === '/history'
              ? 'bg-primary/10 text-primary border-r-2 border-primary'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700'
          }`}
          href="/history"
          onClick={closeMobileMenu}
        >
          <span className="material-icons-round text-lg sm:text-[20px]">
            history
          </span>
          History
        </Link>

        {/* <div className="pt-8 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
          Library
        </div>
        <Link
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-md"
          href="/coming_soon"
          onClick={closeMobileMenu}
        >
          <span className="material-icons-round text-[20px]">menu_book</span>
          ASTM Standards
        </Link>
        <Link
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-md"
          href="/coming_soon"
          onClick={closeMobileMenu}
        >
          <span className="material-icons-round text-[20px]">inventory_2</span>
          Material DB
        </Link> */}
      </nav>

      <div className="p-2 sm:p-4 border-t border-border-light dark:border-border-dark">
        <button
          type="button"
          className="flex items-center gap-2 sm:gap-3 w-full px-2 sm:px-3 py-2.5 sm:py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 rounded-md transition-colors"
          onClick={toggleDarkMode}
        >
          <span className="material-icons-round text-lg sm:text-[20px] dark:hidden">
            dark_mode
          </span>
          <span className="material-icons-round text-lg sm:text-[20px] hidden dark:block">
            light_mode
          </span>
          Theme Toggle
        </button>
      </div>
    </>
  );
}
