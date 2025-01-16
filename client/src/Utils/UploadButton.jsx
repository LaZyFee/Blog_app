/* eslint-disable react/prop-types */
import { IoCloudUploadOutline } from "react-icons/io5";

export const UploadButton = ({ params }) => {
  return (
    <>
      <label
        htmlFor="image"
        className="btn bg-primary text-white lg:w-1/2 flex items-center justify-center gap-2 cursor-pointer"
      >
        <IoCloudUploadOutline /> Upload Image
      </label>
      <input type="file" id="image" className="hidden" onChange={params} />
    </>
  );
};
