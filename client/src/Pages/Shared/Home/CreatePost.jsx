import { NavLink } from "react-router-dom";
import { useAuth } from "../../../Store/AuthStore";

function CreatePost() {
  const { user } = useAuth();

  // Ensure the component only renders if `user` exists
  if (!user) {
    return null;
  }

  return (
    <div className="card card-side bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg w-full max-w-3xl mx-auto my-5 p-5 border border-blue-200 hover:shadow-2xl transition-shadow duration-300">
      <NavLink
        to="/profile"
        aria-label="Go to profile"
        className="flex-shrink-0"
      >
        <figure className="relative">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/${user.profilePic.replace(
              /^src\//,
              ""
            )}`}
            alt={user.name || "Profile Picture"}
            className="rounded-full w-20 h-20 lg:w-24 lg:h-24 border-4 border-blue-300 object-cover transition-transform duration-300 hover:scale-105"
          />
        </figure>
      </NavLink>
      <div className="card-body flex flex-col justify-center pl-5">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-700">
          Hello, <span className="text-primary">{user.name}</span>!
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          What&apos;s on your mind? Share your thoughts with everyone.
        </p>
        <NavLink to="/create-blog">
          <button
            className="btn bg-primary text-white w-full py-3 text-lg rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            aria-label="Create a new post"
          >
            Create Post
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default CreatePost;
