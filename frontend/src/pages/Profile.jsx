import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, loading: authLoading, checkAuthStatus, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [myBlogs, setMyBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Settings Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editGender, setEditGender] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Guard: Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      if (!user) return;
      setLoadingBlogs(true);
      const res = await apiFetch('/blog/my-blogs');
      if (res.success && res.data.blogs) {
        setMyBlogs(res.data.blogs);
      }
      setLoadingBlogs(false);
    };
    fetchMyBlogs();

    // Set initial edit state fields
    if (user) {
      setEditName(user.fullName || '');
      setEditGender(user.gender || 'male');
    }
  }, [user]);

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this story?')) {
      return;
    }

    setDeletingId(blogId);
    const res = await apiFetch(`/blog/${blogId}`, {
      method: 'DELETE'
    });
    setDeletingId(null);

    if (res.success) {
      setMyBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
      addToast('Story deleted successfully!', 'success');
    } else {
      addToast(res.message || 'Failed to delete the article.', 'error');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      addToast('Name field cannot be blank.', 'error');
      return;
    }

    setSaveLoading(true);
    const res = await apiFetch('/user/edit', {
      method: 'POST',
      body: {
        fullName: editName.trim(),
        gender: editGender
      }
    });
    setSaveLoading(false);

    if (res.success) {
      addToast('Profile updated successfully!', 'success');
      setIsModalOpen(false);
      checkAuthStatus(); // Refresh session info
    } else {
      addToast(res.message || 'Failed to update profile settings.', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') {
      addToast('Please type DELETE to confirm account deactivation.', 'error');
      return;
    }

    if (!window.confirm('WARNING: Are you absolutely sure you want to delete your account? All your blogs and comments will be permanently lost!')) {
      return;
    }

    setDeleteLoading(true);
    const res = await apiFetch('/user/delete', {
      method: 'POST'
    });
    setDeleteLoading(false);

    if (res.success) {
      addToast('Your account has been deleted successfully.', 'info');
      logout(); // Clear local session
      navigate('/');
    } else {
      addToast(res.message || 'Failed to delete account.', 'error');
    }
  };

  const computeReadTime = (content) => {
    const words = (content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min read`;
  };

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto"></div>
        <p className="text-sm text-slate-505 mt-4">Loading your profile details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-in fade-in duration-300">
      
      {/* Profile Header section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100/80 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-brand-50 dark:bg-brand-950/40 border-2 border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-400 font-display font-black flex items-center justify-center text-3xl shadow-sm">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-3">
              <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                {user.fullName}
              </h1>
              <button
                onClick={() => {
                  setEditName(user.fullName || '');
                  setEditGender(user.gender || 'male');
                  setDeleteInput('');
                  setIsModalOpen(true);
                }}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
                title="Profile Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/50 text-brand-650 dark:text-brand-400 border border-brand-100/40 dark:border-brand-900/30 px-2.5 py-1 rounded-md">
                {user.role}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/30 px-2.5 py-1 rounded-md">
                {user.gender}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200/60 dark:border-slate-800/60 pt-4 md:pt-0 md:pl-8">
          <div className="text-center md:text-left space-y-0.5">
            <p className="font-display font-black text-2xl text-slate-900 dark:text-slate-100">{user.followers?.length || 0}</p>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Followers</p>
          </div>
          <div className="text-center md:text-left space-y-0.5">
            <p className="font-display font-black text-2xl text-slate-900 dark:text-slate-100">{user.following?.length || 0}</p>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Following</p>
          </div>
          <div className="text-center md:text-left space-y-0.5">
            <p className="font-display font-black text-2xl text-slate-900 dark:text-slate-100">{myBlogs.length}</p>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Stories</p>
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">Profile Settings</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Modal Body / Update Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="block w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-450 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Gender
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditGender('male')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      editGender === 'male'
                        ? 'border-brand-500 bg-brand-50/50 text-brand-700 dark:text-brand-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="10" r="8"/><path d="M12 18v6"/><path d="M9 21h6"/></svg>
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditGender('female')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      editGender === 'female'
                        ? 'border-brand-500 bg-brand-50/50 text-brand-700 dark:text-brand-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="10" r="8"/><path d="M12 18v6"/><path d="M9 21h6"/></svg>
                    Female
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={saveLoading}
                className="w-full py-2.5 px-5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {saveLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>

            {/* Danger Zone: Account Deletion */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 space-y-3 text-left">
              <h4 className="text-xs font-bold text-red-650 dark:text-red-400 uppercase tracking-wider">Danger Zone</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-normal">
                Deleting your account is permanent. This will remove all your written posts and comment histories completely.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="flex-grow py-2 px-3.5 rounded-xl border border-red-200 dark:border-red-950 bg-red-50/20 dark:bg-red-950/10 text-xs text-slate-905 dark:text-slate-100 placeholder-red-300 dark:placeholder-red-900 focus:border-red-500 outline-none transition-all"
                  placeholder="Type 'DELETE' to confirm"
                />
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteInput !== 'DELETE'}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer shrink-0 text-center"
                >
                  {deleteLoading ? 'Deactivating...' : 'Deactivate Account'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
            Your Published Stories
          </h2>
          <Link
            to="/addblog"
            className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            + Create Story
          </Link>
        </div>

        {loadingBlogs ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm animate-pulse p-4 space-y-4">
                <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : myBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4">
            <div className="text-4xl">✍️</div>
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-200 text-lg">No stories published yet</h3>
            <p className="text-slate-505 dark:text-slate-400 text-sm max-w-xs mx-auto">
              You haven't written any blog articles. Launch the Creator Studio and draft your very first story today!
            </p>
            <Link
              to="/addblog"
              className="inline-block py-2.5 px-5 text-sm font-semibold rounded-xl text-white bg-brand-500 hover:bg-brand-600 transition-all shadow"
            >
              Write Your First Story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {myBlogs.map((blog) => (
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
                    <span className="py-1 px-2.5 rounded-lg text-[9px] font-bold tracking-wider uppercase bg-white/90 dark:bg-slate-950/90 text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-sm border border-slate-200/10 dark:border-slate-800/30">
                      {blog.category || 'Software Engineering'}
                    </span>
                  </div>
                </Link>

                {/* Text Content */}
                <div className="flex-grow p-5 space-y-4 flex flex-col">
                  
                  {/* Meta details */}
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-505 font-semibold">
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

                  {/* Likes/Comments Stats Row */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-505 font-bold border-t border-slate-50 dark:border-slate-800/40 pt-3">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                      {blog.likes?.length || 0} Likes
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      {blog.comments?.length || 0} Comments
                    </span>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      {new Date(blog.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    
                    <button
                      onClick={() => handleDelete(blog._id)}
                      disabled={deletingId === blog._id}
                      className="py-1.5 px-3 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-655 dark:text-red-400 rounded-lg text-[10px] font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      {deletingId === blog._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
