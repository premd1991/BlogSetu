import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-in fade-in duration-300">
      
      {/* 404 Visual Icon Element */}
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Glow circles behind the numbers */}
        <div className="absolute inset-0 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute inset-4 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-2xl animate-bounce duration-10000"></div>
        
        {/* Giant Floating SVG Icon representing 404 */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-28 h-28 text-brand-500 dark:text-brand-450 drop-shadow-lg">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </div>

      {/* Header and Details text */}
      <div className="space-y-3 max-w-md">
        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border border-brand-100/40 dark:border-brand-900/30 uppercase">
          Error 404
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight leading-none">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The story you are looking for has been moved, deleted, or never existed. Let's get you back on the right path.
        </p>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-xs sm:max-w-none">
        <Link
          to="/"
          className="w-full sm:w-auto py-3 px-6 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-500 hover:to-orange-400 shadow-md hover:shadow-orange-500/20 active:scale-95 transition-all text-center cursor-pointer"
        >
          Return Home
        </Link>
        <Link
          to="/blogs"
          className="w-full sm:w-auto py-3 px-6 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-205 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all text-center border border-slate-250/30 dark:border-slate-800 cursor-pointer"
        >
          Browse All Blogs
        </Link>
      </div>

    </div>
  );
};

export default NotFound;
