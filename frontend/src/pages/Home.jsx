import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      setLoading(true);
      const res = await apiFetch('/blog?page=1&limit=3');
      if (res.success && res.data.blogs) {
        setBlogs(res.data.blogs);
      }
      setLoading(false);
    };
    fetchLatestBlogs();
  }, []);

  // Helper to compute dynamic read time based on content length
  const computeReadTime = (content) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const time = Math.ceil(words / 200); // 200 words per minute average reading speed
    return `${time} min read`;
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold tracking-wider text-brand-700 dark:text-brand-300 bg-brand-100/50 dark:bg-brand-950/30 uppercase border border-brand-200/30 dark:border-brand-800/40">
              ⚡ Bridge of Knowledge
            </span>
            <h1 className="font-display font-black text-4xl sm:text-6xl text-slate-900 dark:text-white tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-500">
              Connecting Minds Through{' '}
              <span className="bg-gradient-to-r from-brand-600 to-orange-500 bg-clip-text text-transparent">
                Shared Stories
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-600">
              Welcome to SetuBlog. Write, share, explore, and dive into thought-provoking posts created by a global community of thinkers and creators.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Link
                to="/blogs"
                className="py-3.5 px-8 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-500 hover:to-orange-400 shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                Explore Blogs
              </Link>
              <Link
                to="/addblog"
                className="py-3.5 px-8 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 cursor-pointer"
              >
                Write a Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Latest Blogs Grid Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Fresh Content</span>
            <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight">
              Recently Published Stories
            </h2>
          </div>
          <Link to="/blogs" className="text-sm font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1 group">
            View all stories
            <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          // Skeleton loading state
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm animate-pulse space-y-4 p-4">
                <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
            <p className="text-slate-400 dark:text-slate-500">No blog posts found. Be the first to add a story!</p>
            <Link
              to="/addblog"
              className="inline-block py-2.5 px-5 text-sm font-semibold rounded-xl text-white bg-brand-500 hover:bg-brand-600 shadow transition-all cursor-pointer"
            >
              Add a Blog Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog._id} 
                className="group flex flex-col bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden hover:shadow-xl dark:hover:shadow-brand-500/5 hover:scale-[1.02] transition-all duration-300"
              >
                {/* Header Image */}
                <Link to={`/blog/${blog._id}`} className="relative block overflow-hidden aspect-[16/10] bg-slate-100 dark:bg-slate-800">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="py-1 px-2.5 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-white/90 dark:bg-slate-950/90 text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-sm border border-slate-200/10 dark:border-slate-800/30">
                      Article
                    </span>
                  </div>
                </Link>

                {/* Content Area */}
                <div className="flex-grow p-5 space-y-3.5 flex flex-col">
                  
                  {/* Category and Readtime */}
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
                      <span>{blog.category || 'Software Engineering'}</span>
                    </div>
                    <span>{computeReadTime(blog.content)}</span>
                  </div>

                  {/* Title and description */}
                  <div className="space-y-1.5 flex-grow">
                    <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                      <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {blog.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-100 dark:bg-slate-800/80 pt-1"></div>

                  {/* Author Row */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/40 text-brand-700 dark:text-brand-400 text-xs font-bold flex items-center justify-center">
                        {blog.createdby?.fullName?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                        {blog.createdby?.fullName || 'Anonymous'}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      {new Date(blog.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
