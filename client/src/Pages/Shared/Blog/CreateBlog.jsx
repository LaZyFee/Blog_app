/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useBlogStore from "../../../Store/BlogStore";
import showToast from "../../../Utils/ShowToast";

// Separate ImageUploader Component
function ImageUploader({ image, setImage }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      setImage(file);
    } else {
      showToast("Error", "Please upload a valid image (JPEG/PNG)", "error");
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-semibold">Upload Cover Image</label>
      {image && (
        <div className="mt-4">
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="mt-2 w-full h-72 object-contain rounded-md border"
          />
        </div>
      )}
      <label
        htmlFor="image"
        className="btn bg-primary text-white lg:w-1/3 flex items-center justify-center gap-2 cursor-pointer"
      >
        <IoCloudUploadOutline /> Upload Image
      </label>
      <input
        type="file"
        id="image"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
}

// Main CreateBlog Component
function CreateBlog() {
  const { createBlog } = useBlogStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !content) {
      showToast("Error", "Title and content are required", "error");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await createBlog({
        title,
        content,
        image,
      });
      setTitle("");
      setContent("");
      setImage(null);
      showToast("Success", "Blog created successfully!", "success");
      navigate("/");
    } catch (error) {
      setError(error.message || "Failed to create blog");
      showToast("Error", error.message || "Failed to create blog", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 container mx-auto bg-base-300 p-6 rounded-lg">
      <h1 className="text-3xl font-bold text-center text-primary">
        Create a Rich Blog
      </h1>

      {/* Image Uploader */}
      <ImageUploader image={image} setImage={setImage} />

      {/* Title Input */}
      <div className="space-y-2">
        <label className="text-lg font-semibold">Blog Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title..."
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <label className="text-lg font-semibold">Content</label>
        <ReactQuill
          theme="snow"
          value={content}
          className="rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:outline-none h-[500px]"
          onChange={setContent}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ font: ["serif", "monospace", "sans-serif"] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              [{ align: [] }, "blockquote", "code-block"],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "font",
            "bold",
            "italic",
            "underline",
            "strike",
            "color",
            "background",
            "list",
            "bullet",
            "indent",
            "align",
            "blockquote",
            "code-block",
          ]}
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Publish Button */}
      <div className="flex justify-end mt-20">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`py-3 px-6 rounded-md text-lg font-semibold shadow-md transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-secondary"
          }`}
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </div>
    </div>
  );
}

export default CreateBlog;
