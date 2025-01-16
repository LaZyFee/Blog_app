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
  const { blogs, fetchBlogs, loading, error, toggleLike } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const sortedBlogs = [...(blogs || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Truncate long descriptions
  const truncateDescription = (description, maxLength = 300) => {
    if (description.length > maxLength) {
      return `${description.slice(
        0,
        maxLength
      )}<span style="color: var(--primary); font-weight: 600;">.....read more</span>`;
    }
    return description;
  };

  if (loading) return <Skeleton />;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {sortedBlogs.map((blog) => (
        <div
          key={blog._id}
          className="p-6 rounded-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-2"
          data-aos="fade-up"
        >
          {/* Image Section */}
          <div className="overflow-hidden rounded-lg">
            <img
              src={blog.image}
              alt={blog.title}
              loading="lazy"
              className="h-[250px] w-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>

          {/* Metadata Section */}
          <div className="flex justify-between items-center pt-4 text-gray-600">
            <p className="flex items-center gap-2 text-sm">
              <IoMdTime className="text-gray-400" />{" "}
              {formatDate(blog.createdAt)}
            </p>
            <Link
              to="/user"
              state={{ userId: blog.createdBy?._id }}
              className="flex items-center gap-2 text-sm font-medium hover:text-blue-500"
            >
              <img
                src={blog.createdBy?.profilepic}
                alt={blog.createdBy?.name || "Unknown Author"}
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              {blog.createdBy?.name
                ? blog.createdBy.name.split(" ").slice(-1).join(" ")
                : "Unknown Author"}
            </Link>
          </div>

          {/* Content Section */}
          <Link to={"/blog-data"} state={{ blogId: blog._id }}>
            <div className="space-y-3 py-3">
              <h2 className="text-lg font-semibold text-primary text-pre-wrap">
                {blog.title}
              </h2>
              <p
                className="text-sm leading-relaxed text-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(truncateDescription(blog.content)),
                }}
              />
            </div>
          </Link>

          {/* Divider */}
          <div className="border-t my-4"></div>

          {/* Actions Section */}
          <div className="flex justify-between items-center">
            <UserReact
              id={blog._id}
              likes={Array.isArray(blog.likes) ? blog.likes : []} // Ensure likes is an array
              dislikes={Array.isArray(blog.disLikes) ? blog.disLikes : []} // Ensure disLikes is an array
              reactions={Array.isArray(blog.reactions) ? blog.reactions : []} // Ensure reactions is an array
              toggleLike={toggleLike}
            />

            <div className="flex items-center gap-4 text-gray-500">
              <Link to={"/blog-data"} state={{ blogId: blog._id }}>
                <div className="flex items-center gap-1">
                  <GoComment className="text-lg cursor-pointer hover:text-blue-500" />
                  <span className="text-sm text-gray-600">
                    ({blog.commentsCount || 0})
                  </span>
                </div>
              </Link>
              <FiShare2 className="text-lg cursor-pointer hover:text-blue-500" />
              <FaRegBookmark className="text-lg cursor-pointer hover:text-blue-500" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Blog;
