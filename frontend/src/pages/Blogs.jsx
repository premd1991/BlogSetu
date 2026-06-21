import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const categories = ['All', 'AI', 'Software Engineering', 'IT & Systems', 'Cloud', 'Web Development'];

  // Debounce search query to reduce API hits
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch paginated blogs based on search, category, and page
  useEffect(() => {
    const fetchAllBlogs = async () => {
      setLoading(true);
      const categoryParam = selectedCategory === 'All' ? 'All' : selectedCategory;
      const res = await apiFetch(
        `/blog?page=${currentPage}&limit=6&search=${encodeURIComponent(debouncedSearch)}&category=${encodeURIComponent(categoryParam)}`
      );
      if (res.success && res.data.blogs) {
        setBlogs(res.data.blogs);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalBlogs(res.data.pagination.totalBlogs || 0);
        } else {
          setTotalPages(1);
          setTotalBlogs(res.data.blogs.length);
        }
      }
      setLoading(false);
    };
    fetchAllBlogs();
  }, [currentPage, debouncedSearch, selectedCategory]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 3;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 2;
      }

      if (start > 2) {
        pages.push('...');
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const computeReadTime = (content) => {
    const words = (content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min read`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Search and Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800/80 pb-8">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">The Catalog</span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Explore All Stories
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Read expert articles, technical writeups, and deep thoughts shared by the community.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            placeholder="Search by title, description or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full py-3 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-905 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`py-2 px-5 rounded-full text-xs font-bold transition-all active:scale-95 duration-200 cursor-pointer border
              ${selectedCategory === cat
                ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/10'
                : 'bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {loading ? (
        // Grid Loading Skeleton
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm animate-pulse p-4 space-y-4">
              <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
          <div className="text-4xl">🔍</div>
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-200 text-lg">No matches found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
            We couldn't find any blogs matching your active filters. Try resetting the category or searching a different keyword.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {blogs.map((blog) => (
            <article 
              key={blog._id} 
              className="group flex flex-col bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden hover:shadow-xl dark:hover:shadow-brand-500/5 hover:scale-[1.02] transition-all duration-300"
            >
              {/* Cover Image */}
              <Link to={`/blog/${blog._id}`} className="relative block overflow-hidden aspect-[16/10] bg-slate-100 dark:bg-slate-850">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="py-1 px-2.5 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-white/90 dark:bg-slate-950/90 text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-sm border border-slate-200/20 dark:border-slate-800/30">
                    {blog.category || 'Software Engineering'}
                  </span>
                </div>
              </Link>

              {/* Text Content */}
              <div className="flex-grow p-5 space-y-3.5 flex flex-col">
                
                {/* Meta details */}
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
                    <span>{blog.category || 'Software Engineering'}</span>
                  </div>
                  <span>{computeReadTime(blog.content)}</span>
                </div>

                {/* Title and summary */}
                <div className="space-y-1.5 flex-grow">
                  <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                    <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {blog.description}
                  </p>
                </div>

                {/* Separator line */}
                <div className="h-px bg-slate-100 dark:bg-slate-800/80 pt-1"></div>

                {/* Author Card Footer */}
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

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-8 gap-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing <span className="text-slate-805 dark:text-slate-200">{((currentPage - 1) * 6) + 1}</span> to{' '}
            <span className="text-slate-805 dark:text-slate-200">
              {Math.min(currentPage * 6, totalBlogs)}
            </span>{' '}
            of <span className="text-slate-805 dark:text-slate-200">{totalBlogs}</span> stories
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer"
              aria-label="Previous Page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>

            {getPageNumbers().map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 dark:text-slate-600 select-none text-xs font-bold">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-xl font-bold text-xs transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center border
                    ${currentPage === page
                      ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/10'
                      : 'bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer"
              aria-label="Next Page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Blogs;
