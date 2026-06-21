import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../context/ToastContext';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, checkAuthStatus } = useAuth();
  const { addToast } = useToast();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Social interactive states
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      setLoading(true);
      setErrorMsg('');
      const res = await apiFetch(`/blog/${id}`);
      if (res.success && res.data.blog) {
        const fetchedBlog = res.data.blog;
        setBlog(fetchedBlog);
        setComments(fetchedBlog.comments || []);
        setLikesCount(fetchedBlog.likes?.length || 0);
        
        const author = fetchedBlog.createdby;
        if (author) {
          setFollowersCount(author.followers?.length || 0);
        }
      } else {
        setErrorMsg(res.message || 'Failed to load article detail.');
      }
      setLoading(false);
    };
    fetchBlogDetail();
  }, [id]);

  // Sync like/follow statuses when user or blog state changes
  useEffect(() => {
    if (blog) {
      if (user) {
        const hasLiked = blog.likes?.some(uid => (uid._id || uid).toString() === user._id.toString());
        setIsLiked(hasLiked || false);

        const author = blog.createdby;
        if (author) {
          const hasFollowed = author.followers?.some(uid => (uid._id || uid).toString() === user._id.toString());
          setIsFollowing(hasFollowed || false);
        }
      } else {
        setIsLiked(false);
        setIsFollowing(false);
      }
    }
  }, [blog, user]);

  const handleDelete = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    const res = await apiFetch(`/blog/${id}`, {
      method: 'DELETE'
    });
    setDeleteLoading(false);

    if (res.success) {
      addToast('Story deleted successfully!', 'success');
      navigate('/blogs');
    } else {
      addToast(res.message || 'Failed to delete the article.', 'error');
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const res = await apiFetch(`/social/like/${id}`, {
      method: 'POST'
    });
    if (res.success) {
      setIsLiked(res.data.isLiked);
      setLikesCount(res.data.likesCount);
      // Synchronize in blog object too
      setBlog(prev => {
        if (!prev) return prev;
        const newLikes = res.data.isLiked 
          ? [...(prev.likes || []), user._id] 
          : (prev.likes || []).filter(uid => uid.toString() !== user._id.toString());
        return { ...prev, likes: newLikes };
      });
    } else {
      addToast(res.message || 'Failed to toggle like', 'error');
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const authorId = blog?.createdby?._id;
    if (!authorId) return;

    const res = await apiFetch(`/social/follow/${authorId}`, {
      method: 'POST'
    });
    if (res.success) {
      setIsFollowing(res.data.isFollowing);
      setFollowersCount(res.data.followersCount);
      
      // Update follow status in AuthContext and locally
      checkAuthStatus();
      setBlog(prev => {
        if (!prev || !prev.createdby) return prev;
        const newFollowers = res.data.isFollowing 
          ? [...(prev.createdby.followers || []), user._id]
          : (prev.createdby.followers || []).filter(uid => uid.toString() !== user._id.toString());
        return {
          ...prev,
          createdby: { ...prev.createdby, followers: newFollowers }
        };
      });
    } else {
      addToast(res.message || 'Failed to toggle follow', 'error');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    setCommentLoading(true);
    const res = await apiFetch(`/social/comment/${id}`, {
      method: 'POST',
      body: { text: commentText.trim() }
    });
    setCommentLoading(false);
    if (res.success) {
      setComments(res.data.comments);
      setCommentText('');
      // Sync in blog state
      setBlog(prev => (prev ? { ...prev, comments: res.data.comments } : prev));
      addToast('Comment posted!', 'success');
    } else {
      addToast(res.message || 'Failed to add comment', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    const res = await apiFetch(`/social/comment/${id}/${commentId}`, {
      method: 'DELETE'
    });
    if (res.success) {
      setComments(res.data.comments);
      // Sync in blog state
      setBlog(prev => (prev ? { ...prev, comments: res.data.comments } : prev));
      addToast('Comment deleted!', 'info');
    } else {
      addToast(res.message || 'Failed to delete comment', 'error');
    }
  };

  // Helper to determine ownership of the blog post
  const isOwner = blog && user && (blog.createdby?._id === user._id || user.role === 'Admin');

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 space-y-6 animate-pulse">
        <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (errorMsg || !blog) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h3 className="font-display font-bold text-slate-800 dark:text-slate-200 text-lg">Article not found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{errorMsg || 'The post you are trying to view does not exist.'}</p>
        <Link
          to="/blogs"
          className="inline-block py-2.5 px-5 text-sm font-semibold rounded-xl text-white bg-brand-500 hover:bg-brand-600 transition-all shadow"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-in fade-in duration-300">
         {/* Back navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link 
          to="/blogs" 
          className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 flex items-center gap-1 group transition-colors uppercase tracking-wider"
        >
          <span className="transform group-hover:-translate-x-0.5 transition-transform font-sans">&larr;</span>
          Back to articles
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2">
            <Link
              to={`/edit-blog/${id}`}
              className="py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-350 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              Edit Story
            </Link>
            
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="py-2 px-3.5 rounded-xl text-xs font-semibold text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer border border-red-100/50 dark:border-red-900/30"
            >
              {deleteLoading ? (
                'Deleting...'
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  Delete Story
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Blog Main Info Header */}
      <header className="space-y-5 text-center max-w-3xl mx-auto">
        <span className="inline-block py-1 px-3 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-100/40 dark:border-brand-900/30">
          {blog.category || 'Software Engineering'}
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight">
          {blog.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed italic">
          {blog.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-slate-200/50 dark:bg-slate-800/60 max-w-sm mx-auto"></div>

        {/* Author Row with Follow integration */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900/40 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center text-sm shadow-sm">
              {blog.createdby?.fullName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-left text-xs">
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{blog.createdby?.fullName || 'Anonymous'}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Published on {new Date(blog.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          {user?._id !== blog.createdby?._id && blog.createdby && (
            <div className="flex items-center gap-2.5 pl-0 sm:pl-4 sm:border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={handleFollowToggle}
                className={`py-1.5 px-4 rounded-full text-[11px] font-bold tracking-wide transition-all active:scale-95 duration-200 flex items-center gap-1 cursor-pointer
                  ${isFollowing 
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700' 
                    : 'bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/10'}`}
              >
                {isFollowing ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Following
                  </>
                ) : (
                  '+ Follow'
                )}
              </button>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium bg-slate-100/80 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 py-1 px-2.5 rounded-full">
                {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Cover Image */}
      <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/60 shadow-md relative bg-slate-100 dark:bg-slate-850">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Rich Text Content */}
      <div className="max-w-3xl mx-auto pt-6">
        <div 
          className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-sans
            prose-headings:font-display prose-headings:font-extrabold prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:mb-5 prose-p:text-base sm:prose-p:text-[17px]
            prose-a:text-brand-500 hover:prose-a:text-brand-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline transition-all
            prose-blockquote:border-l-4 prose-blockquote:border-brand-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-300 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/60 prose-blockquote:p-2 prose-blockquote:rounded-r-xl
            prose-strong:font-bold prose-strong:text-slate-800 dark:prose-strong:text-slate-200
            prose-img:rounded-2xl prose-img:shadow-md prose-img:border prose-img:border-slate-100 dark:prose-img:border-slate-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* Social Actions Panel */}
      <div className="max-w-3xl mx-auto py-6 border-y border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLikeToggle}
            className={`py-2 px-4 rounded-full text-xs font-bold transition-all active:scale-95 duration-200 flex items-center gap-2 cursor-pointer
              ${isLiked 
                ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-900/30 shadow-sm' 
                : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="15" 
              height="15" 
              viewBox="0 0 24 24" 
              fill={isLiked ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth="2.5" 
              className={`transition-transform duration-300 ${isLiked ? 'scale-110 text-brand-500 animate-pulse' : 'text-slate-500 dark:text-slate-400'}`}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
            <span>{likesCount} Likes</span>
          </button>
          
          <div className="text-slate-300 dark:text-slate-700 text-sm">
            &bull;
          </div>
          
          <div className="text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-slate-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 px-3 py-1.5 rounded-lg">
            {blog.category || 'Software Engineering'}
          </span>
        </div>
      </div>

      {/* Discussion / Comments Section */}
      <div className="max-w-3xl mx-auto space-y-6 pt-4">
        <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white flex items-center gap-2">
          Discussion ({comments.length})
        </h3>
        
        {/* Comment input form */}
        {user ? (
          <form onSubmit={handleAddComment} className="space-y-3">
            <div className="relative group">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What are your thoughts on this story? Join the conversation..."
                rows="3"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-4 pb-12 text-sm text-slate-800 dark:text-slate-250 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100/10 outline-none transition-all resize-none"
              ></textarea>
              <div className="absolute right-3 bottom-3">
                <button
                  type="submit"
                  disabled={commentLoading || !commentText.trim()}
                  className="py-1.5 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-center space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-450 font-medium">Log in to join the conversation and share your thoughts.</p>
            <Link
              to="/login"
              className="inline-block py-2 px-5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Sign In to Comment
            </Link>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4 pt-2">
          {comments.length > 0 ? (
            comments.map((comment) => {
              const commentUserId = comment.user?._id || comment.user;
              const isCommentOwner = user && (commentUserId === user._id || user.role === 'Admin' || blog.createdby?._id === user._id);
              
              return (
                <div 
                  key={comment._id} 
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow dark:hover:shadow-brand-500/5 transition-shadow space-y-3 animate-in fade-in duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-950/50 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center text-xs border border-brand-200 dark:border-brand-900/40">
                        {comment.user?.fullName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 dark:text-slate-205 text-xs">
                            {comment.user?.fullName || 'Anonymous User'}
                          </p>
                          {commentUserId === blog.createdby?._id && (
                            <span className="text-[9px] font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-1.5 py-0.5 rounded border border-brand-100/50 dark:border-brand-900/30">Author</span>
                          )}
                        </div>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {new Date(comment.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {isCommentOwner && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete comment"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    )}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pl-1 whitespace-pre-line">
                    {comment.text}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm border-2 border-dashed border-slate-100 dark:border-slate-800/80 rounded-2xl">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>

    </article>
  );
};

export default BlogDetail;

