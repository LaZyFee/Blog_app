import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useBlogStore from "../../../Store/BlogStore";
import Skeleton from "../../../Components/Skeleton";
import { IoMdTime } from "react-icons/io";
import { formatDate } from "../../../Utils/formatedate";
import CommentSection from "./CommentSection";
import DOMPurify from "dompurify";

function DetailsBlog() {
  const location = useLocation();
  const navigate = useNavigate();
  const blogId = location.state?.blogId;
  const { blog, fetchBlogById, loading, error, clearError } = useBlogStore();
  const [loadedId, setLoadedId] = useState(null);

  useEffect(() => {
    let active = true;
    setLoadedId(null);
    if (!blogId) return () => { active = false; };
    fetchBlogById(blogId).then((result) => { if (active && result.success) setLoadedId(blogId); });
    return () => { active = false; };
  }, [blogId, fetchBlogById]);

  if (!blogId) return <div className="p-6 text-center text-gray-600">This post link is incomplete. <Link to="/blog" className="text-primary underline">Browse posts</Link>.</div>;
  if (loading || (blog && loadedId !== blogId)) return <Skeleton />;
  if (error) return <div role="alert" className="mx-auto max-w-3xl p-6 text-red-600">{error}<button type="button" className="ml-3 underline" onClick={clearError}>Dismiss</button><button type="button" className="ml-3 underline" onClick={() => fetchBlogById(blogId)}>Retry</button><button type="button" className="ml-3 underline" onClick={() => navigate(-1)}>Go back</button></div>;
  if (!blog || loadedId !== blogId) return <div className="p-6 text-center text-gray-500">Blog not found. <Link to="/blog" className="text-primary underline">Browse posts</Link></div>;

  const safeContent = DOMPurify.sanitize(blog.content || "", { ADD_TAGS: ["blockquote", "pre", "h2", "h3", "span"], ADD_ATTR: ["class", "style"] });
  return <><article className="mx-auto max-w-4xl p-6">{blog.image && <div className="relative overflow-hidden rounded-lg shadow-lg"><img src={blog.image} alt={blog.title} className="h-[400px] w-full object-cover" /></div>}<header className="mt-5"><h1 className="text-3xl font-bold">{blog.title}</h1><div className="mt-3 flex items-center gap-4 text-gray-600"><Link to="/user" state={{ userId: blog.createdBy?._id }} className="flex items-center gap-2 hover:underline">{blog.createdBy?.profilepic && <img src={blog.createdBy.profilepic} alt="" className="h-8 w-8 rounded-full object-cover" />}<span>{blog.createdBy?.name || "Unknown Author"}</span></Link><span className="flex items-center gap-1 text-sm"><IoMdTime />{formatDate(blog.createdAt)}</span></div></header><div className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: safeContent }} /></article><CommentSection key={blogId} blogId={blogId} /></>;
}

export default DetailsBlog;
