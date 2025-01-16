/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoTrashOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { useTeamStore } from "../../../Store/TeamStore";
import { UploadButton } from "../../../Utils/UploadButton";
import showToast from "../../../Utils/ShowToast";

function CreateTeam() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { createTeamMember, isLoading, error } = useTeamStore();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("role", data.role);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      await createTeamMember(formData);
      showToast("Success", "Team member added successfully!", "success");
      reset();
      setSelectedImage(null);
      setImagePreview(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error || "Failed to add team member",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-5">
        Add Your Team Mate
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="my-4 w-full">
        <div className="flex flex-col lg:flex-row gap-5 bg-base-200 p-5 rounded-lg min-h-72 mx-5 md:mx-10">
          <div className="w-full flex flex-col gap-4">
            {imagePreview && (
              <div className="relative mt-4">
                <label className=" -content font-semibold">
                  Team Member Image
                </label>
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-full h-64 object-contain rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-orange-500 text-white p-2 rounded-full hover:bg-red-600"
                  onClick={handleRemoveImage}
                >
                  <IoTrashOutline className="text-xl" />
                </button>
              </div>
            )}
            <label htmlFor="name" className="font-semibold">
              Team Member Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Team Member Name"
              {...register("name", {
                required: "Team Member Name is required",
              })}
              className="input input-bordered w-full bg-white text-black"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}

            <label htmlFor="role" className="font-semibold">
              Member Role
            </label>
            <input
              id="role"
              type="text"
              placeholder="Member Role"
              {...register("role", {
                required: "Member Role is required",
              })}
              className="input input-bordered w-full bg-white text-black"
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}

            <UploadButton params={handleImageChange} />
          </div>
        </div>

        <div className="flex justify-end lg:mx-10 mt-4">
          <button
            type="submit"
            className="btn bg-orange-500 px-8 py-2 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
}

export default CreateTeam;
