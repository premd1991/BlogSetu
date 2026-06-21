import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../context/ToastContext';

// Dynamic import to optimize chunk bundling and improve initial load time
const JoditEditor = React.lazy(() => import('jodit-react'));

const AddBlog = () => {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);

  const editor = useRef(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Load existing blog details if in Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchBlogDetails = async () => {
        setLoadingData(true);
        const res = await apiFetch(`/blog/${id}`);
        if (res.success && res.data.blog) {
          const blog = res.data.blog;
          
          // Ownership verification
          if (user && blog.createdby?._id !== user._id && user.role !== 'Admin') {
            addToast("You are not authorized to edit this story", "error");
            navigate('/blogs');
            return;
          }
          
          setTitle(blog.title || '');
          setDescription(blog.description || '');
          setContent(blog.content || '');
          setImage(blog.image || '');
          setCategory(blog.category || 'Software Engineering');
        } else {
          addToast(res.message || 'Failed to load story for editing.', 'error');
          navigate('/blogs');
        }
        setLoadingData(false);
      };

      if (!authLoading && user) {
        fetchBlogDetails();
      }
    }
  }, [id, isEditMode, authLoading, user, navigate, addToast]);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Start writing your story...',
      minHeight: 300,
      buttons: [
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'font', 'fontsize', 'brush', 'paragraph', '|',
        'image', 'table', 'link', 'align', '|',
        'undo', 'redo', 'hr', 'eraser', 'fullsize'
      ]
    }),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !content.trim()) {
      addToast('Please fill in the title, description, and content.', 'error');
      return;
    }

    setLoading(true);
    const url = isEditMode ? `/blog/${id}` : '/blog';
    const method = isEditMode ? 'PATCH' : 'POST';

    const response = await apiFetch(url, {
      method,
      body: {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        category,
        image: image.trim() || undefined // If blank, let backend use default image fallback
      }
    });
    setLoading(false);

    if (response.success) {
      addToast(isEditMode ? 'Blog post updated successfully!' : 'Blog post published successfully!', 'success');
      setTimeout(() => {
        navigate(isEditMode ? `/blog/${id}` : '/blogs');
      }, 1200);
    } else {
      addToast(response.message || 'Failed to submit post.', 'error');
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setImage('');
    setCategory('Software Engineering');
    addToast('Studio fields reset', 'info');
  };

  if (loadingData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto"></div>
        <p className="text-sm text-slate-500 mt-4">Loading your story context...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-6 space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Creator Studio</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          {isEditMode ? 'Edit Your Story' : 'Write a New Story'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isEditMode 
            ? 'Modify your article, adjust descriptive tags, and publish your updates.'
            : 'Draft your article, add beautiful rich-text paragraphs, upload an image, and share it with the world.'}
        </p>
      </div>

      {/* Main Studio Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Editor Form - Left Side (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form className="glass-panel p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 dark:bg-slate-900/60 space-y-6" onSubmit={handleSubmit}>

            {/* Title Field */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Article Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                placeholder="Ex: The Future of Server-Driven Web Design"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Short Description / Summary
              </label>
              <textarea
                id="description"
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none resize-none"
                placeholder="Provide a concise 1-2 sentence overview of your post..."
              />
            </div>

            {/* Category Select Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Article Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none cursor-pointer"
              >
                <option value="Software Engineering" className="dark:bg-slate-950">Software Engineering</option>
                <option value="AI" className="dark:bg-slate-950">AI</option>
                <option value="IT & Systems" className="dark:bg-slate-950">IT & Systems</option>
                <option value="Cloud" className="dark:bg-slate-950">Cloud</option>
                <option value="Web Development" className="dark:bg-slate-950">Web Development</option>
              </select>
            </div>

            {/* Image URL Field */}
            <div className="space-y-1.5">
              <label htmlFor="image" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Header Image URL
              </label>
              <input
                id="image"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="block w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                placeholder="Ex: https://images.unsplash.com/... (or leave empty for fallback)"
              />
            </div>

            {/* Jodit Rich Text Editor */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Article Body Content
              </label>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-inner bg-slate-50 dark:bg-slate-950/20">
                <Suspense
                  fallback={
                    <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-900/40 animate-pulse flex flex-col items-center justify-center gap-3">
                      <svg className="animate-spin h-7 w-7 text-brand-650" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Loading Editor Workspace...</span>
                    </div>
                  }
                >
                  <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1}
                    onBlur={(newContent) => setContent(newContent)}
                    onChange={() => {}}
                  />
                </Suspense>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-grow py-3 px-6 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-500 hover:to-orange-400 shadow-md hover:shadow-orange-500/25 active:scale-95 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    {isEditMode ? 'Updating Post...' : 'Publishing Post...'}
                  </>
                ) : (
                  isEditMode ? 'Update Post' : 'Publish Post'
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-355 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
              >
                Reset Studio
              </button>
            </div>

          </form>
        </div>

        {/* Real-time Live Preview - Right Side (4 Cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Live Preview</span>
            <div className="group flex flex-col bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md overflow-hidden transition-all pointer-events-none">
              
              {/* Cover Image Preview */}
              <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-400 text-sm">
                <img
                  src={image.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop'}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="py-1 px-2.5 rounded-lg text-[9px] font-bold tracking-wider uppercase bg-white/90 dark:bg-slate-950/90 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200/10 dark:border-slate-800/30">
                    {category}
                  </span>
                </div>
              </div>

              {/* Text content preview */}
              <div className="p-5 space-y-3.5 flex flex-col">
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
                    <span>{category}</span>
                  </div>
                  <span>Read Time Preview</span>
                </div>

                <div className="space-y-1.5 flex-grow">
                  <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                    {title.trim() || 'Untitled Post'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {description.trim() || 'This post has no summary yet. Write a brief overview on the left input area...'}
                  </p>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800/80 pt-1"></div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900/40 text-brand-700 dark:text-brand-400 text-xs font-bold flex items-center justify-center">
                      {user?.fullName?.charAt(0).toUpperCase() || 'Y'}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {user?.fullName || 'Your Name'}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    {new Date().toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddBlog;
