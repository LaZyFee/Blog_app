/*eslint-disable*/
import { useState } from "react";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import showToast from "../../../Utils/ShowToast";
import { useTeamStore } from "../../../Store/TeamStore";

function UpdateTeamModal({ onClose, data }) {
  const { updateTeamMember } = useTeamStore();
  const [removeImage, setRemoveImage] = useState(false);

  const [formData, setFormData] = useState({
    name: data?.name || "",
    role: data?.role || "",
    image: null, // File object for upload
  });
  const [imagePreview, setImagePreview] = useState(
    data?.image ? `${import.meta.env.VITE_BACKEND_URL}/${data.image}` : null
  );

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
      updatedData.append("removeImage", true);
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
            <div className="flex flex-col gap-4">
              <label className="text-gray-700 font-semibold">
                Current Image
              </label>
              <img
                src={
                  data.image && !removeImage
                    ? `${import.meta.env.VITE_BACKEND_URL}/${data.image}`
                    : ""
                }
                className="w-40 h-32 object-cover object-center"
                alt={data.name}
              />
              <label htmlFor="name" className="text-gray-700 font-semibold">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder={data.name}
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
                placeholder={data.role}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-white text-black"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-gray-700 font-semibold">Image</label>
              {imagePreview && (
                <div className="relative mt-2">
                  <img
                    src={imagePreview}
                    alt="Selected"
                    className="w-40 h-36 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    onClick={handleRemoveImage}
                  >
                    <IoTrashOutline className="text-xl" />
                  </button>
                </div>
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
                disabled={removeImage}
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={removeImage}
                  onChange={handleRemoveImage}
                />
                <span className="text-gray-700 font-semibold">
                  Remove Existing Image
                </span>
              </label>

              <div className="flex justify-between mt-5">
                <button
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTeamModal;
