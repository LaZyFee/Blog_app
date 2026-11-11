import { useEffect } from "react";
import useBlogStore from "../../../Store/BlogStore";
import { IoMdTime } from "react-icons/io";
import { Link } from "react-router-dom";
import Skeleton from "../../../Components/Skeleton";
import { formatDate } from "../../../Utils/formatedate";
import UserReact from "../../../Utils/UserReact";
import DOMPurify from "dompurify";
import { GoComment } from "react-icons/go";
import { FiShare2 } from "react-icons/fi";
import { FaRegBookmark } from "react-icons/fa";

function Blog() {
  const { blogs, pagination, fetchBlogs, loading, error, toggleLike, clearError } = useBlogStore();
  useEffect(() => {
    fetchBlogs({ page: 1, limit: 10 });
  }, [fetchBlogs]);

  const preview = (content = "", length = 300) => content.length > length ? `${content.slice(0, length)}…` : content;
  const loadPage = (page) => fetchBlogs({ page, limit: pagination.limit });

  if (loading && blogs.length === 0) return <Skeleton />;

  return (
    <section className="space-y-5">
      {error && <div role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}<button className="ml-3 underline" onClick={clearError}>Dismiss</button></div>}
      {blogs.length === 0 && !loading ? <p className="text-center text-gray-500">No posts found.</p> : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {blogs.map((blog) => (
            <article key={blog._id} className="rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
              {blog.image && <div className="overflow-hidden rounded-lg"><img src={blog.image} alt={blog.title} loading="lazy" className="h-[250px] w-full object-cover" /></div>}
              <div className="flex items-center justify-between gap-3 pt-4 text-gray-600">
                <p className="flex items-center gap-2 text-sm"><IoMdTime />{formatDate(blog.createdAt)}</p>
                <Link to="/user" state={{ userId: blog.createdBy?._id }} className="flex items-center gap-2 text-sm font-medium hover:text-blue-500">
                  {blog.createdBy?.profilepic && <img src={blog.createdBy.profilepic} alt="" className="h-8 w-8 rounded-full border object-cover" />}
                  {blog.createdBy?.name || "Unknown Author"}
                </Link>
              </div>
              <Link to="/blog-data" state={{ blogId: blog._id }} className="block space-y-3 py-3">
                <h2 className="text-lg font-semibold text-primary">{blog.title}</h2>
                <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(preview(blog.content)) }} />
              </Link>
              <div className="my-4 border-t" />
              <div className="flex items-center justify-between">
                <UserReact id={blog._id} likes={blog.likes || 0} dislikes={blog.disLikes || 0} reactions={blog.reactions || []} toggleLike={toggleLike} />
                <div className="flex items-center gap-4 text-gray-500">
                  <Link to="/blog-data" state={{ blogId: blog._id }} className="flex items-center gap-1"><GoComment /><span className="text-sm">({blog.commentsCount || 0})</span></Link>
                  <button type="button" aria-label="Share post" onClick={() => navigator.share?.({ title: blog.title, url: window.location.href })}><FiShare2 /></button>
                  <FaRegBookmark aria-label="Save post (not available yet)" title="Bookmarks are not available yet" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {pagination.totalPages > 1 && <nav aria-label="Blog pages" className="flex items-center justify-center gap-4">
        <button type="button" disabled={pagination.page <= 1 || loading} onClick={() => loadPage(pagination.page - 1)} className="rounded border px-3 py-2 disabled:opacity-50">Previous</button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button type="button" disabled={pagination.page >= pagination.totalPages || loading} onClick={() => loadPage(pagination.page + 1)} className="rounded border px-3 py-2 disabled:opacity-50">Next</button>
      </nav>}
      {loading && blogs.length > 0 && <p role="status" className="text-center">Loading posts…</p>}
    </section>
  );
}

export default Blog;
