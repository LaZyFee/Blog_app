/* eslint-disable */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Store/AuthStore";
import PasswordStrengthMeter from "../PasswordStrenthMeter/PasswordStrenthMeter";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import showToast from "../../../Utils/ShowToast";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [signUpError, setSignUpError] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSignUp = async (data) => {
    const { name, email, password, profilepic } = data;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", profilepic[0]);

    try {
      await signup(formData);
      showToast("Success!", "Account created successfully!", "success");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error signing up";
      setSignUpError(errorMessage); // For additional error handling if needed
      showToast("Error", errorMessage, "error");
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
    <div className="flex w-full flex-col items-center justify-center min-h-screen py-10 px-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Create Account
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Unlock amazing features by joining us!
        </p>
        <form className="space-y-6 mt-8" onSubmit={handleSubmit(handleSignUp)}>
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-contain rounded-lg"
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

          {/* Name Input */}
          <div className="form-control">
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Full Name"
              className="w-full rounded-lg border border-gray-300 p-3 placeholder-gray-500 focus:ring-2 focus:ring-indigo-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="form-control">
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email Address"
              className="w-full rounded-lg border border-gray-300 p-3 placeholder-gray-500 focus:ring-2 focus:ring-indigo-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="form-control">
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
                pattern: {
                  value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/,
                  message:
                    "Password must include uppercase, number, and special character",
                },
              })}
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 p-3 placeholder-gray-500 focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Password Strength Meter */}
          {password && <PasswordStrengthMeter password={password} />}

          {/* File Upload */}
          <div>
            <label
              htmlFor="profilepic"
              className="flex items-center justify-center w-full py-3 bg-primary text-white rounded-lg cursor-pointer  lg:w-1/2"
            >
              <IoCloudUploadOutline className="text-xl" />
              <span className="ml-2">Upload Profile Picture</span>
            </label>
            <input
              type="file"
              id="profilepic"
              className="hidden"
              {...register("profilepic", {
                required: "Profile picture is required",
              })}
              onChange={(e) => {
                handleImageChange(e); // Preview the image
                const { onChange } = register("profilepic");
                onChange(e); // Update the form value
              }}
            />

            {errors.profilepic && (
              <p className="text-red-500 text-sm mt-1">
                {errors.profilepic.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              className={`w-full lg:w-1/2 py-3 rounded-lg text-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-transform ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
