import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20 animate-in fade-in duration-700">
      
      {/* 1. Header Hero / Manifesto Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
          <span className="text-xs font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            01 / Identity & Mission
          </span>
        </div>
        
        <h1 className="font-display font-black text-4xl sm:text-6xl text-slate-900 dark:text-white leading-[1.1] tracking-tight">
          Bridging thoughts, connecting{' '}
          <span className="bg-gradient-to-r from-brand-600 to-orange-500 bg-clip-text text-transparent">
            diverse voices.
          </span>
        </h1>
        
        <hr className="border-t border-slate-200/80 dark:border-slate-800/80" />
        
        <p className="text-xl sm:text-2xl font-light text-slate-800 dark:text-slate-200 leading-relaxed font-sans max-w-4xl">
          "Setu" (सेतु) represents a bridge. SetuBlog is a minimalist, secure, and modern publishing environment built to connect authors with readers, raw thoughts with structured insights, and diverse viewpoints with a global audience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          <div className="space-y-4">
            <p>
              In a digital world that is often fragmented and cluttered, SetuBlog is designed to bring back the focus to deep, focused storytelling. By offering writers a distraction-free typing studio and readers a clean, modern typographic layout, we cultivate a space for genuine ideas to breathe and grow.
            </p>
            <p>
              Whether you write detailed technical tutorials, share creative prose, or analyze cultural trends, SetuBlog serves as a reliable vehicle to translate your individual brilliance into collective learning.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              Our design philosophy is minimalist yet premium. We believe that visual excellence encourages interaction. Every micro-animation, transition, and theme shift is tailored to respect the reader's focus and the author's voice.
            </p>
            <p>
              SetuBlog is built on a high-performance full-stack foundation. We are committed to maintaining a secure, lightning-fast platform that bridges the gap between authors and a community driven by curiosity and respect.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Core Pillars / Values Section */}
      <section className="space-y-10">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
          <span className="text-xs font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            02 / Core Pillars
          </span>
        </div>

        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          How We Shape the Experience
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          <div className="border-t-2 border-slate-200 dark:border-slate-800 pt-6 hover:border-brand-500 dark:hover:border-brand-500 transition-colors duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-500 mb-4 group-hover:scale-110 transition-transform duration-200">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
            </svg>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">
              Refined Expression
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              A distraction-free writing environment that lets your thoughts shine without structural clutter or complexity.
            </p>
          </div>

          <div className="border-t-2 border-slate-200 dark:border-slate-800 pt-6 hover:border-brand-500 dark:hover:border-brand-500 transition-colors duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-500 mb-4 group-hover:scale-110 transition-transform duration-200">
              <path d="M3 21h18"/>
              <path d="M3 10V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5"/>
              <path d="M5 10v6a3 3 0 0 0 6 0v-6"/>
              <path d="M13 10v6a3 3 0 0 0 6 0v-6"/>
            </svg>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">
              Connected Minds
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Fostering authentic dialogue across diverse viewpoints to expand horizons and challenge perspectives.
            </p>
          </div>

          <div className="border-t-2 border-slate-200 dark:border-slate-800 pt-6 hover:border-brand-500 dark:hover:border-brand-500 transition-colors duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-500 mb-4 group-hover:scale-110 transition-transform duration-200">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">
              Sleek Execution
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              State-of-the-art MERN architecture delivering lightning-fast page loading and premium visual responsiveness.
            </p>
          </div>

          <div className="border-t-2 border-slate-200 dark:border-slate-800 pt-6 hover:border-brand-500 dark:hover:border-brand-500 transition-colors duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-500 mb-4 group-hover:scale-110 transition-transform duration-200">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">
              Data Integrity
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Robust modern authentication algorithms and database protections keeping your intellectual work secure.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Learn More / Networks Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
          <span className="text-xs font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            03 / Our Networks
          </span>
        </div>

        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          Explore the Community
        </h2>

        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
          Discover the ideas driving our platform or customize your profile space to begin documenting your thoughts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 font-display font-bold text-sm pt-2">
          <Link to="/blogs" className="group inline-flex items-center gap-1.5 text-slate-900 dark:text-white hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
            Explore the Blogs
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-800">|</span>
          <Link to="/profile" className="group inline-flex items-center gap-1.5 text-slate-900 dark:text-white hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
            Visit your Profile
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* 4. Call to Action Row */}
      <section className="space-y-6">
        <hr className="border-t border-slate-200/80 dark:border-slate-800/80" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-4">
          <div className="space-y-2">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Have a story you want to share?
            </h3>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl">
              Join our community of thinkers, technical experts, and creatives. Share your perspective and publish your first article today.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Link
              to="/addblog"
              className="group inline-flex items-center gap-2.5 py-3.5 px-7 text-sm font-semibold rounded-xl text-white bg-slate-900 hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-brand-500 dark:hover:text-white shadow-sm hover:shadow-brand-500/10 active:scale-[0.98] transition-all cursor-pointer"
            >
              Start Writing Now
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform duration-200"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
        
        <hr className="border-t border-slate-200/80 dark:border-slate-800/80" />
      </section>

      {/* 5. Metadata Bottom Grid Block */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 py-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-b border-slate-200/80 dark:border-slate-800/80 pb-10">
        <div className="space-y-3">
          <h4 className="font-display font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">
            Editorial Space
          </h4>
          <p className="space-y-1">
            <span>SetuBlog Project Space</span><br />
            <span>102 Bridge Avenue, Tech District</span><br />
            <span>New Delhi, DL 110001</span><br />
            <span className="block mt-2 font-medium text-slate-700 dark:text-slate-300">
              contact@setublog.org
            </span>
          </p>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-display font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">
            About the Project
          </h4>
          <p>
            SetuBlog is built as an open, community-driven blogging platform demonstrating state-of-the-art MERN architecture. It bridges individual creative expression with clean modern aesthetics and secure content workflows.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-display font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">
            Direct Links
          </h4>
          <div className="grid grid-cols-2 gap-2 font-medium">
            <Link to="/" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
              Home
            </Link>
            <Link to="/blogs" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
              All Blogs
            </Link>
            <Link to="/addblog" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
              Add Blog
            </Link>
            <Link to="/profile" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
              Profile
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
