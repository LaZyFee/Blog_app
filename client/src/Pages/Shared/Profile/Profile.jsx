import { useEffect } from "react";
import { useAuth } from "../../../Store/AuthStore";
import { useTeamStore } from "../../../Store/TeamStore";

function Profile() {
  const { user } = useAuth();
  const { userProfile, isLoading, error, getProfile } = useTeamStore();

  useEffect(() => {
    if (user?._id) {
      getProfile(user._id);
    }
  }, [user, getProfile]);

  return (
    <div className="mt-10">
      {/* Display profile card */}
      {isLoading ? (
        <p className="text-center">Loading profile...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        userProfile && (
          <div className="card card-side bg-base-100 shadow-xl w-screen md:w-96 mx-auto">
            <figure>
              <img
                src={userProfile.profileImage || "/default-profile.png"}
                className="rounded-xl"
                alt="user profile"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title whitespace-nowrap">
                {userProfile.name || "Unknown User"}
              </h2>
              <p>{userProfile.email || "No email available"}</p>
            </div>
          </div>
        )
      )}

      {/* Team Members */}
      <h1 className="text-xl md:text-3xl text-center font-semibold mt-6">
        Team Members
      </h1>
      {userProfile?.team?.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {userProfile.team.map((member) => (
            <div className="card bg-base-100 shadow-xl" key={member._id}>
              <figure>
                <img
                  src={member.profileImage || "/default-team-member.png"}
                  alt={`${member.name || "Team Member"}`}
                  className="rounded-xl"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {member.name || "Unnamed Member"}
                </h2>
                <p>{member.role || "Role not specified"}</p>
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No team members found.</p>
      )}

      {/* Published Blogs */}
      <h1 className="text-xl md:text-3xl text-center font-semibold mt-6">
        Published Blogs
      </h1>
      {userProfile?.author?.length > 0 ? (
        <ul className="mt-4">
          {userProfile.author.map((blog) => (
            <li
              key={blog._id}
              className="text-center text-lg bg-gray-100 p-2 rounded-md shadow-md mb-2"
            >
              {blog.title || "Untitled Blog"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No blogs published yet.</p>
      )}
    </div>
  );
}

export default Profile;
