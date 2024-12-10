import { useAuth } from "../../../Store/AuthStore";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="mt-10">
      <div className="card card-side bg-base-100 shadow-xl w-screen md:w-96 mx-auto">
        <figure>
          <img
            src={
              user.profilePic
                ? `${import.meta.env.VITE_BACKEND_URL}/${user.profilePic}`
                : "noImageFound"
            }
            className="rounded-xl"
            alt="user profile"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title whitespace-nowrap">{user.name}</h2>
          <p>{user.email}</p>
          <div className="card-actions justify-end mt-5">
            <button className="btn btn-error text-white">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
