import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      navigate('/login');
    }
  };

  const linkClass = ({ isActive }) =>
    `relative py-2 px-1 text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'text-brand-600 dark:text-brand-500 font-semibold'
        : 'text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400'
    }`;

  const underlineClass = ({ isActive }) =>
    `absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-full transition-all duration-300 transform scale-x-0 origin-left ${
      isActive ? 'scale-x-100' : 'group-hover:scale-x-100'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl h-[70px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-10 w-10 rounded-full object-cover border-2 border-brand-500/50 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to stylized SVG avatar if logo.png doesn't exist
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden h-10 w-10 rounded-full bg-brand-500 text-white font-bold items-center justify-center text-lg border-2 border-brand-600 shadow-sm">
              S
            </div>
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-brand-600 to-orange-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            SetuBlog
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-7">
            <li className="group">
              <NavLink to="/" className={linkClass}>
                Home
                <span className={underlineClass({ isActive: window.location.pathname === '/' })}></span>
              </NavLink>
            </li>
            <li className="group">
              <NavLink to="/blogs" className={linkClass}>
                Blogs
                <span className={underlineClass({ isActive: window.location.pathname.startsWith('/blogs') })}></span>
              </NavLink>
            </li>
            <li className="group">
              <NavLink to="/about" className={linkClass}>
                About
                <span className={underlineClass({ isActive: window.location.pathname === '/about' })}></span>
              </NavLink>
            </li>
            {user && (
              <>
                <li className="group">
                  <NavLink to="/addblog" className={linkClass}>
                    Add Blog
                    <span className={underlineClass({ isActive: window.location.pathname === '/addblog' })}></span>
                  </NavLink>
                </li>
                <li className="group">
                  <NavLink to="/profile" className={linkClass}>
                    Profile
                    <span className={underlineClass({ isActive: window.location.pathname === '/profile' })}></span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Divider */}
          <span className="h-5 w-px bg-slate-200 dark:bg-slate-800"></span>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-brand-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-brand-400 transition-all duration-300 cursor-pointer active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            )}
          </button>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-950 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center text-sm">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="py-2.5 px-5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-500 hover:to-orange-400 shadow-md hover:shadow-orange-500/20 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-4 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-5 duration-200">
          <ul className="space-y-1.5">
            <li>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-brand-500 dark:hover:text-brand-400 transition-all"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-brand-500 dark:hover:text-brand-400 transition-all"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-brand-500 dark:hover:text-brand-400 transition-all"
              >
                About
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link
                    to="/addblog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-brand-500 dark:hover:text-brand-400 transition-all"
                  >
                    Add Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-brand-500 dark:hover:text-brand-400 transition-all"
                  >
                    Profile
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Theme Toggle Switch */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Theme</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 transition-all cursor-pointer active:scale-95"
            >
              {theme === 'light' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  Dark Mode
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                  Light Mode
                </>
              )}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-950 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center text-xs">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                    {user.fullName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-brand-600 to-orange-500 hover:opacity-90 shadow-md transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
