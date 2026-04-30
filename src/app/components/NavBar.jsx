'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useResult } from '../context/ResultContext';

function NavBar({
  variant = 'sidebar',
  icon = 'settings_input_component',
  brandName = 'Bolt',
  brandHighlight = 'Calculator',
  showSocialLinks = false,
}) {
  const { setIsMobileMenuOpen } = useResult();
  // console.log(onMobileMenuOpen);

  const [isDarkMode, setIsDarkMode] = useState(
    typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark'),
  );

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode((prev) => !prev);
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  // Horizontal navbar variant for marketing pages
  if (variant === 'horizontal') {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark md:bg-surface-light/80 md:dark:bg-surface-dark/80 backdrop-blur-none md:backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-start md:justify-between w-full">
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
              <span
                className="material-symbols-outlined text-white text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {icon}
              </span>
            </div>
            <span className="font-bold text-xl tracking-tight whitespace-nowrap">
              {brandName}
              <span className="text-primary">{brandHighlight}</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400 shrink-0">
            <Link className="hover:text-primary transition-colors" href="/home">
              Home
            </Link>
            <Link
              className="hover:text-primary transition-colors"
              href="/home#features"
            >
              Features
            </Link>
            <Link
              className="hover:text-primary transition-colors"
              href="/blogs"
            >
              Blogs
            </Link>
            <Link
              className="hover:text-primary transition-colors"
              href="/about"
            >
              About
            </Link>
            <Link
              className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md shadow-primary/20 btn-glow transform hover:scale-105"
              href="/input"
            >
              Launch Calculator
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="bg-primary p-1.5 sm:p-2 rounded-lg text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-xl sm:text-2xl">
                settings_input_component
              </span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight">
                Bolt{' '}
                <span className="text-slate-500 font-normal">Calculator</span>
              </h1>
            </div>
          </Link>
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => {
                console.log('clicked');
                openMobileMenu();
              }}
              className="p-2 -mr-2 cursor-pointer material-icons-round text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              aria-label="Open menu"
            >
              menu
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default NavBar;
