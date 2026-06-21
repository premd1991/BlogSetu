import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 pt-12 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Upper Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100 dark:border-slate-800/60">
          
          {/* Brand/About Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display font-extrabold text-2xl bg-gradient-to-r from-brand-600 to-orange-500 bg-clip-text text-transparent">
                SetuBlog
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Discover unique insights, tech reviews, creative writing, and expert thoughts. We connect ideas to build a stronger bridge of shared knowledge.
            </p>
          </div>

          {/* Quick Links Col */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  All Blogs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect/Socials Col */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">Connect With Us</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Have a story to share or a question to ask? We'd love to hear from you.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-500 dark:hover:text-brand-400 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-300"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-500 dark:hover:text-brand-400 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-300"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-500 dark:hover:text-brand-400 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Lower copyright section */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 text-xs text-slate-400 dark:text-slate-500 gap-3">
          <p>&copy; {currentYear} SetuBlog. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
