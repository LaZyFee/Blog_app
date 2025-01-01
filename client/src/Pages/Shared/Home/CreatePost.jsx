import { NavLink } from "react-router-dom";
import { useAuth } from "../../../Store/AuthStore";

function CreatePost() {
  const { user } = useAuth();

  return (
    <div className="card card-side rounded-lg w-full max-w-lg mx-auto mt-5 p-3">
      <NavLink to="/profile">
        <figure>
          <img
            src={
              user.profilePic ||
              `${import.meta.env.VITE_BACKEND_URL}/${user.profilePic}`
            }
            alt={user.name}
            className="h-20 w-20 rounded-full"
          />
        </figure>
      </NavLink>
      <div className="card-body">
        <button className="btn rounded-2xl" aria-label="Share your thoughts">
          What&apos;s on your mind?
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
