import { useEffect } from "react";
import useBlogStore from "../../../Store/BlogStore";
import Skeleton from "../../../Components/Skeleton";
import { Link, useLocation } from "react-router-dom";
import { IoMdTime } from "react-icons/io";
import { formatDate } from "../../../Utils/formatedate";

function DetailsBlog() {
  const location = useLocation();
  const { blogId } = location.state || {};
  const { blog, fetchBlogById, loading, error } = useBlogStore();

  useEffect(() => {
    if (blogId) fetchBlogById(blogId);
  }, [blogId, fetchBlogById]);
  console.log(blog);

  if (loading) return <Skeleton />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!blog) return <p className="text-gray-500">Blog not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Blog Header with Image */}
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <img
          src={
            blog.image
              ? `${import.meta.env.VITE_BACKEND_URL}/${blog.image.replace(
                  /^src\//,
                  ""
                )}`
              : "/default-profile.png"
          }
          alt={blog.title}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">{blog.title}</h1>
          <div className="flex justify-center items-center gap-4 text-white">
            {/* Author Information */}
            <Link
              to="/user"
              state={{ userId: blog.createdBy?._id }}
              className="flex items-center gap-2 hover:underline"
            >
              <img
                src={
                  blog.createdBy?.profilepic
                    ? `${
                        import.meta.env.VITE_BACKEND_URL
                      }/${blog.createdBy.profilepic.replace(/^src\//, "")}`
                    : "/default-profile.png"
                }
                alt={blog.createdBy?.name || "Unknown Author"}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="font-medium">
                {blog.createdBy?.name || "Unknown Author"}
              </span>
            </Link>

            {/* Published Date */}
            <div className="flex items-center gap-1 text-sm">
              <IoMdTime />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="mt-6 text-gray-800 leading-relaxed space-y-4">
        <p
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {blog.content}
        </p>
      </div>
    </div>
  );
}

export default DetailsBlog;
