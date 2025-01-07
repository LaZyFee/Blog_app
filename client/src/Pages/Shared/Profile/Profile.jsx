import { useEffect } from "react";
import { useAuth } from "../../../Store/AuthStore";
import { useTeamStore } from "../../../Store/TeamStore";

function Profile() {
  const { user } = useAuth();
  const { userProfile, isLoading, error, getProfile } = useTeamStore();
  console.log(userProfile);

  useEffect(() => {
    if (user?._id) {
      getProfile(user._id);
    }
  }, [user, getProfile]);

  return (
    <div className="w-full">
      {/* Display profile card */}
      {isLoading ? (
        <p className="text-center text-lg text-indigo-600">
          Loading profile...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 font-semibold">Error: {error}</p>
      ) : (
        userProfile && (
          <div className="card card-side bg-gradient-to-r from-blue-100 to-indigo-200 p-6 rounded-lg flex items-center">
            <figure className="flex-shrink-0">
              <img
                src={`${
                  import.meta.env.VITE_BACKEND_URL
                }/${user.profilePic.replace(/^src\//, "")}`}
                className="rounded-full w-36 h-36 md:w-48 md:h-48 border-4 border-indigo-300 shadow-lg"
                alt="user profile"
              />
            </figure>
            <div className="card-body ml-6">
              <h2 className="card-title text-2xl font-bold text-gray-800">
                {userProfile.name || "Unknown User"}
              </h2>
              <p className="text-lg text-gray-600 mt-2">
                {userProfile.email || "No email available"}
              </p>
            </div>
          </div>
        )
      )}

      {/* Team Members */}
      <h1 className="text-2xl md:text-3xl text-center font-semibold mt-12 text-indigo-700">
        Team Members
      </h1>
      {userProfile?.team?.length > 0 ? (
        <ul className="grid grid-cols-1">
          {userProfile.team.map((member) => (
            <div
              key={member._id}
              className="card card-side max-w-screen p-2 flex items-center"
            >
              {/* Member Image */}
              <figure className="flex-shrink-0">
                <img
                  src={
                    member.image
                      ? `${
                          import.meta.env.VITE_BACKEND_URL
                        }/${member.image.replace(/^src\//, "")}`
                      : "/default-profile.png"
                  }
                  alt={member.name || "Team Member"}
                  className="rounded-full w-36 h-36 border-4 border-base-300 shadow-lg"
                />
              </figure>

              {/* Member Info */}
              <div className="card-body ml-6">
                <h2 className="card-title text-2xl font-bold text-orange-600">
                  {member.name || "Unnamed Member"}
                </h2>
                <p>{member.role || "Role not specified"}</p>
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-4">No team members found.</p>
      )}

      {/* Published Blogs */}
      <h1 className="text-2xl md:text-3xl text-center font-semibold mt-12 text-indigo-700">
        Published Blogs
      </h1>
      {userProfile?.author?.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {userProfile.author.map((blog) => (
            <li
              key={blog._id}
              className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg p-4 text-center text-lg font-medium text-gray-700"
            >
              {blog.title || "Untitled Blog"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No blogs published yet.
        </p>
      )}
    </div>
  );
}

export default Profile;
