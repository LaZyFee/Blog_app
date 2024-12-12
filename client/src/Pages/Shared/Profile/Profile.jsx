import { useAuth } from "../../../Store/AuthStore";

function Profile() {
  const { user } = useAuth();
  console.log(user);

  return (
    <div className="mt-10">
      {user
        ? user && (
            <div className="card card-side bg-base-100 shadow-xl w-screen md:w-96 mx-auto">
              <figure>
                <img src="" className="rounded-xl" alt="user profile" />
              </figure>
              <div className="card-body">
                <h2 className="card-title whitespace-nowrap">{user.name}</h2>
                <p>{user.email}</p>
              </div>
            </div>
          )
        : ""}
      <h1 className="text-xl md:text-3xl text-center font-semibold">
        Team Member
      </h1>
      <h1 className="text-xl md:text-3xl text-center font-semibold">
        Published BLogs
      </h1>
    </div>
  );
}

export default Profile;
