import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setErrorMsg(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      
      {/* Absolute floating bubbles for ambient style */}
      <div className="absolute top-[20%] right-[15%] w-72 h-72 rounded-full bg-brand-400/10 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[10%] w-80 h-80 rounded-full bg-orange-400/10 blur-[90px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="inline-block py-1.5 px-3 rounded-full text-xs font-semibold tracking-wider text-brand-600 bg-brand-50 uppercase">
            Welcome Back
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-sm text-slate-500">
            Or{' '}
            <Link to="/register" className="font-semibold text-brand-500 hover:text-brand-600 transition-colors">
              create a new account
            </Link>
          </p>
        </div>

        {/* Card Panel */}
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-xl border border-white/50 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="p-3 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-100 flex items-center gap-2 animate-shake">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-2 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {successMsg}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full py-3 px-4 rounded-xl border border-slate-200 bg-white/50 focus:bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full py-3 px-4 rounded-xl border border-slate-200 bg-white/50 focus:bg-white text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-grow py-3 px-5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-500 hover:to-orange-400 shadow-md hover:shadow-orange-500/20 active:scale-95 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    Signing In...
                  </>
                ) : (
                  'Login'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('');
                  setPassword('');
                  setErrorMsg('');
                }}
                className="py-3 px-4 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
