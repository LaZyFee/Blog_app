/*eslint-disable*/
import { useState } from "react";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import showToast from "../../../Utils/ShowToast";
import { useTeamStore } from "../../../Store/TeamStore";

function UpdateTeamModal({ onClose, data }) {
  const { updateTeamMember } = useTeamStore();

  const [formData, setFormData] = useState({
    name: data?.name || "",
    role: data?.role || "",
    image: null, // File object for upload
  });

  const [removeImage, setRemoveImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  // Handle toggling image removal
  const handleRemoveSelectedImage = () => {
    setImagePreview(null);
    setSelectedImage(null);
  };
  // Remove selected image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    setRemoveImage(!removeImage);
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("role", formData.role);

    if (removeImage) {
      updatedData.append("removeImage", "true");
    } else if (formData.image) {
      updatedData.append("image", formData.image);
    }

    try {
      await updateTeamMember(data._id, updatedData);
      showToast("Success", "Team member updated successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error updating team member:", error);
      showToast("Error", "Failed to update team member", "error");
    }
  };

  const OnClickCancel = () => {
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <form onSubmit={handleUpdate}>
          <div className="bg-white p-5 lg:p-10 rounded-lg min-h-72">
            {/* Text Inputs */}
            <div className="flex flex-col gap-4">
              <label className="text-gray-700 font-semibold">
                Current Image
              </label>
              {data.image && !removeImage ? (
                <img
                  src={`${
                    import.meta.env.VITE_BACKEND_URL
                  }/${data.image.replace(/^src\//, "")}`}
                  className="w-full h-60 object-cover rounded-lg"
                  alt={data.name || "Current Image"}
                />
              ) : (
                <p className="text-gray-500 italic">No image selected.</p>
              )}

              <label htmlFor="name" className="text-gray-700 font-semibold">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-white text-black"
                required
              />

              <label htmlFor="role" className="text-gray-700 font-semibold">
                Role
              </label>
              <input
                id="role"
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-white text-black"
                required
              />
            </div>

            {/* Image Upload and Preview */}
            <div className="flex flex-col gap-4 mt-5">
              <label className="text-gray-700 font-semibold">Image</label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Selected"
                    className="w-40 h-36 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    onClick={handleRemoveSelectedImage}
                  >
                    <IoTrashOutline className="text-xl" />
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Upload new image to preview.
                </p>
              )}

              <label
                htmlFor="image"
                className="btn bg-primary text-white lg:w-1/2 flex items-center justify-center gap-2 cursor-pointer"
              >
                <IoCloudUploadOutline /> Upload Image
              </label>
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleFileChange}
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={removeImage}
                  onChange={handleRemoveImage}
                />
                <span className="text-gray-700 font-semibold">
                  Remove Image
                </span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between mt-5">
              <button
                type="button"
                className="btn bg-red-500 px-8 py-2 text-white"
                onClick={OnClickCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-primary px-8 py-2 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTeamModal;
