import { NavLink } from "react-router-dom";
import { useAuth } from "../../../Store/AuthStore";

function CreatePost() {
  const { user } = useAuth();

  // Ensure the component only renders if `user` exists
  if (!user) {
    return null;
  }

  return (
    <div className="card card-side bg-base-200 rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-5 p-3">
      <NavLink to="/profile" aria-label="Go to profile">
        <figure>
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/${user.profilePic.replace(
              /^src\//,
              ""
            )}`}
            alt={user.name || "Profile Picture"}
            className="rounded-full w-36 h-36 "
          />
        </figure>
      </NavLink>
      <div className="card-body flex items-center">
        <button
          className="btn rounded-2xl w-full h-full"
          aria-label="Share your thoughts"
        >
          What&apos;s on your mind? Share your thoughts
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
