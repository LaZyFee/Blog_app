import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Store/AuthStore";
import showToast from "../../../Utils/ShowToast";

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
      showToast("Success", "Login successful", "success");
      navigate("/");
    } catch (error) {
      // Check for specific error status
      if (error.response && error.response.status === 401) {
        setLoginError("Invalid email or password, please try again");
        showToast(
          "Error",
          "Invalid email or password, please try again",
          "error"
        );
      } else {
        setLoginError(error.message || "Error logging in");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Blog Web App
          </h1>
          <p className="mt-2 text-gray-600">Log in to your account</p>
        </div>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="space-y-4">
            <div>
              <input
                type="email"
                {...register("email", {
                  required: "Email Address is required",
                })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-indigo-600 text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            New to Blog Web App?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
