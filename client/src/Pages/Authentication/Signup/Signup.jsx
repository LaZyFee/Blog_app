/* eslint-disable */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Store/AuthStore";
import PasswordStrengthMeter from "../PasswordStrenthMeter/PasswordStrenthMeter";
import Swal from "sweetalert2";
import { IoCloudUploadOutline } from "react-icons/io5";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [signUpError, setSignUPError] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const handleSignUp = async (data) => {
    const { name, email, password, profilepic } = data;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilepic", profilepic[0]);

    try {
      await signup(formData);
      Swal.fire({
        title: "Success!",
        text: "Account created successfully!",
        icon: "success",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error signing up";
      setSignUPError(errorMessage);
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="hero my-10">
          <div className="flex-col border border-black p-4 lg:w-1/3">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <div className="card w-full">
              <form className="card-body" onSubmit={handleSubmit(handleSignUp)}>
                <div className="form-control">
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Your Name"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="form-control">
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="Email"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="form-control">
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be 6 characters long",
                      },
                      pattern: {
                        value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/,
                        message:
                          "Password must have uppercase, number, and special characters",
                      },
                    })} // "password"
                    placeholder="Password"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Render PasswordStrengthMeter only if password exists */}
                {password && <PasswordStrengthMeter password={password} />}
                <div>
                  {/* Custom file upload button */}
                  <label
                    htmlFor="profilepic"
                    className="btn bg-[#F63E7B] text-white w-full lg:w-1/2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <IoCloudUploadOutline /> Upload Image
                  </label>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="profilepic"
                    className="hidden"
                    {...register("profilepic", {
                      required: "Profile picture is required",
                    })}
                  />
                  {errors.profilepic && (
                    <p className="text-red-500">{errors.profilepic.message}</p>
                  )}
                </div>

                <div className="form-control mt-6 items-center">
                  <button className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Signing up..." : "Create an account"}
                  </button>
                </div>
              </form>

              <p className="text-center">
                Already have an account?{" "}
                <Link className="text-[#F63E7B]" to="/login">
                  Please Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
