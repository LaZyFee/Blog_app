import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Store/AuthStore";
import Swal from "sweetalert2";

function Login() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleLogin = async (data) => {
    const { email, password } = data;

    try {
      await login(email, password);
      Swal.fire({
        title: "Success",
        text: "Login successful",
        icon: "success",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      navigate("/");
    } catch (error) {
      // Check for specific error status
      if (error.response && error.response.status === 401) {
        setLoginError("Invalid email or password, please try again");
        Swal.fire({
          title: "Error",
          text: "Invalid email or password, please try again",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      } else {
        setLoginError(error.message || "Error logging in");
      }
    }
  };

  return (
    <div className=" min-h-screen">
      {" "}
      <div className="text-center my-10">
        <h1 className="text-3xl font-bold">Welcome to Blog Web App</h1>
      </div>
      <div className="hero">
        <div className="flex-col border border-black p-4 lg:w-1/3">
          <h1 className="text-3xl font-bold my-4">Log in to your account</h1>
          <div className="card w-full max-w-sm shrink-0">
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="form-control">
                <input
                  type="text"
                  {...register("email", {
                    required: "Email Address is required",
                  })}
                  placeholder="Email"
                  className="w-full border-b border-gray-400 bg-transparent p-2 my-2 placeholder-gray-600"
                />
                {errors.email && (
                  <p className="text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="form-control">
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="Password"
                  className="w-full border-b border-gray-400 bg-transparent my-2 p-2 placeholder-gray-600"
                />
                {errors.password && (
                  <p className="text-red-600">{errors.password.message}</p>
                )}
              </div>

              <label className="label">
                {" "}
                <Link className="label-text" to="/forgot-password">
                  Forget Password?
                </Link>
              </label>

              {loginError && <p className="text-red-600">{loginError}</p>}

              <div className="form-control my-3.5">
                <button
                  className="w-full btn btn-primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in" : "Login"}
                </button>
              </div>
            </form>

            <p>
              New to Expense Tracker?{" "}
              <Link className="text-[#F63E7B]" to="/signup">
                Create new Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
