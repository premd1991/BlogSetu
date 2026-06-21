import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950/20 relative">
      
      {/* Dynamic decorative backdrop bubbles for rich modern aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-200/20 dark:bg-orange-950/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-200/10 dark:bg-brand-950/5 blur-[130px] pointer-events-none z-0"></div>

      <Header />

      {/* Main content slot with fade-in and relative mounting */}
      <main className="flex-grow relative z-10 animate-in fade-in duration-500">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
