import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import showToast from "../../../Utils/ShowToast";
import Swal from "sweetalert2";
import useBlogStore from "../../../Store/BlogStore";
import { useAuth } from "../../../Store/AuthStore";
import Skeleton from "../../../Components/Skeleton";
import UpdateBlogModal from "./UpdateBlogModal";
import DOMPurify from "dompurify";

function UpdateBlog() {
  const { blogs, deleteBlog, fetchBlogs, loading } = useBlogStore();
  const { user } = useAuth();

  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Filter blogs created by the current user
  const userBlogs = blogs.filter((blog) => blog.createdBy?._id === user?._id);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteBlog(id);
        showToast("Success", "Blog deleted successfully!", "success");
      } catch (err) {
        showToast("Error", "Failed to delete blog. Please try again.", "error");
        console.error("Error deleting blog:", err);
      }
    }
  };

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-4xl text-center font-bold bg-primary text-white py-4 px-6 rounded-lg shadow-lg">
        Published Blogs
      </h1>

      {userBlogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-8 mx-auto">
          {userBlogs.map((blog) => (
            <div
              key={blog._id}
              className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden w-96"
            >
              <figure className="relative h-40 w-full overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-xl font-semibold mb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 text-pre-wrap">
                  {blog.content.length > 200 ? (
                    <p className="text-gray-600 text-sm mb-4">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            blog.content.slice(0, 200)
                          ),
                        }}
                      />
                    </p>
                  ) : (
                    <p
                      className="text-gray-600 text-sm mb-4"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(blog.content),
                      }}
                    />
                  )}
                </p>
                <div className="flex mt-4 space-x-4">
                  <button
                    className="btn bg-indigo-500 text-white flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
                    onClick={() => setSelectedBlog(blog)}
                  >
                    <FaEdit className="text-lg" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="btn bg-red-500 text-white flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTrashAlt className="text-lg" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No blogs published yet.
        </p>
      )}

      {selectedBlog && (
        <UpdateBlogModal
          data={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      )}
    </div>
  );
}

export default UpdateBlog;
