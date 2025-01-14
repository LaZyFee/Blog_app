import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("Image:", image);
    // Add logic to save the blog
  };

  return (
    <div className="mt-8 container mx-auto bg-base-300 p-6 rounded-lg">
      <h1 className="text-3xl font-bold text-center text-primary">
        Create a Rich Blog
      </h1>
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-lg font-semibold">Upload Cover Image</label>
        {image && (
          <div className="mt-4">
            <img
              src={image}
              alt="Preview"
              className="mt-2 w-full h-60 object-fit rounded-md border"
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
      <div className="">
        <label className="text-lg font-semibold">Content</label>
        <ReactQuill
          theme="snow"
          value={content}
          className="rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:outline-none h-[500px]" // Adjust height here
          onChange={setContent}
          modules={{
            toolbar: [
              // Headings and font settings
              [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
              // Text formatting
              ["bold", "italic", "underline", "strike"],
              // Text color and background color
              [{ color: [] }, { background: [] }],
              // Lists, bullet points, and indents
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              // Alignment and blockquote
              [{ align: [] }, "blockquote", "code-block"],
              // Clear formatting
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
            "hr",
          ]}
        />
      </div>

      {/* Publish Button */}
      <div className="flex justify-end mt-20">
        <button
          onClick={handleSubmit}
          className="bg-primary text-white py-3 px-6 rounded-md text-lg font-semibold shadow-md hover:bg-secondary transition-all duration-300"
        >
          Publish Blog
        </button>
      </div>
    </div>
  );
}

export default CreateBlog;
