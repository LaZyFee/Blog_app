import { useEffect } from "react";
import useBlogStore from "../../../Store/BlogStore";
import { SlDislike, SlLike } from "react-icons/sl";
import { FaRegComment } from "react-icons/fa6";
import Skeleton from "../../../Components/Skeleton";
import { IoMdTime } from "react-icons/io";
import { Link } from "react-router-dom";
import { formatDate } from "../../../Utils/formatedate";

function Blog() {
  const { blogs, fetchBlogs, loading, error } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Truncate long descriptions
  const truncateDescription = (description, maxLength = 500) => {
    if (description.length > maxLength) {
      return (
        <>
          {description.slice(0, maxLength)}
          <span className="text-primary font-semibold">... read more</span>
        </>
      );
    }
    return description;
  };

  if (loading) return <Skeleton />;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {blogs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((blog) => (
          <div
            key={blog._id}
            className="p-4 transition-all duration-500 hover:shadow-xl"
            data-aos="fade-up"
          >
            <div className="overflow-hidden">
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
                className="mx-auto h-[250px] w-full rounded-xl object-cover transition duration-700 hover:skew-x-2 hover:scale-110"
              />
            </div>
            <div className="flex justify-between pt-2 text-slate-600">
              <p className="flex items-center">
                <IoMdTime /> {formatDate(blog.createdAt)}
              </p>
              <Link
                to="/user"
                state={{ userId: blog.createdBy?._id }}
                className="hover:font-bold hover:text-blue-500"
              >
                <p className="line-clamp-1 flex items-center">
                  <img
                    src={
                      blog.createdBy?.profilepic
                        ? `${
                            import.meta.env.VITE_BACKEND_URL
                          }/${blog.createdBy.profilepic.replace(/^src\//, "")}`
                        : "/default-profile.png"
                    }
                    alt={blog.createdBy?.name || "Unknown Author"}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  {blog.createdBy?.name
                    ? blog.createdBy.name.split(" ").slice(-1).join(" ")
                    : "Unknown Author"}
                </p>
              </Link>
            </div>
            <Link to={"/blog-data"} state={{ blogId: blog._id }}>
              <div className="space-y-3 py-3 min-h-[200px] ">
                <h2 className="text-lg font-bold text-primary mb-2">
                  {blog.title}
                </h2>
                <p className="text-sm text-pre-wrap">
                  {truncateDescription(blog.content)}
                </p>
              </div>
            </Link>
            <div className="divider"></div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-3">
                <SlLike className="text-primary text-xl hover:scale-110 cursor-pointer transition duration-200" />
                <SlDislike className="text-primary text-xl hover:scale-110 cursor-pointer transition duration-200" />
              </div>
              <Link to={"/blog-data"} state={{ blogId: blog._id }}>
                <div className="flex items-center gap-1">
                  <FaRegComment className="text-primary text-xl" />
                  <span className="text-sm text-gray-600">
                    ({blog.commentsCount || 0})
                  </span>
                </div>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Blog;
{
  /* <div key={blog._id} className="card hover:shadow-2xl w-full">
            <figure>
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </figure>
            <div className="card-body">
              <div className="flex flex-col mb-3 text-sm text-gray-500">
                <p className="font-semibold text-primary">
                  {blog.createdBy}
                </p>
                <p>{formatDate(blog.createdAt)}</p>
              </div>
              <h2 className="text-lg font-bold text-primary mb-2">
                {blog.title}
              </h2>
              <p
                style={{
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
                className="text-sm text-gray-700"
              >
                {truncateDescription(blog.content)}
              </p>
              <div className="divider"></div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3">
                  <SlLike className="text-primary text-xl hover:scale-110 cursor-pointer transition duration-200" />
                  <SlDislike className="text-primary text-xl hover:scale-110 cursor-pointer transition duration-200" />
                </div>
                <div className="flex items-center gap-1">
                  <FaRegComment className="text-primary text-xl" />
                  <span className="text-sm text-gray-600">
                    ({blog.commentsCount || 0})
                  </span>
                </div>
              </div>
            </div>
          </div> */
}
