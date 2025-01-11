import { useEffect } from "react";
import { useTeamStore } from "../../../Store/TeamStore";
import { Link, useLocation } from "react-router-dom";

function User() {
  const { isLoading, error, getProfile, userProfile } = useTeamStore();
  const location = useLocation();
  const { userId } = location.state || {};

  useEffect(() => {
    if (userId) {
      getProfile(userId);
    }
  }, [userId, getProfile]);

  if (!userId) {
    return <p className="text-center text-gray-500">No user data available.</p>;
  }

  if (isLoading) {
    return (
      <p className="text-center text-lg text-indigo-600">Loading profile...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 font-semibold">
        Error: {error.message || "Failed to load profile."}
      </p>
    );
  }

  if (!userProfile) {
    return <p className="text-center text-gray-500">User profile not found.</p>;
  }

  return (
    <div className="w-full mt-5">
      {/* Profile Card */}
      <div className="card card-side bg-gradient-to-r from-blue-100 to-indigo-200 p-6 rounded-lg flex items-center">
        <figure className="flex-shrink-0">
          <img
            src={
              userProfile.profilepic
                ? `${
                    import.meta.env.VITE_BACKEND_URL
                  }/${userProfile.profilepic.replace(/^src\//, "")}`
                : "/default-profile.png"
            }
            className="rounded-full w-36 h-36 md:w-48 md:h-48 border-4 border-indigo-300 shadow-lg"
            alt={userProfile.name || "User profile"}
          />
        </figure>
        <div className="card-body ml-6">
          <h2 className="card-title text-2xl font-bold text-gray-800">
            {userProfile.name || "Unknown User"}
          </h2>
          <p className="text-lg mt-2">
            {userProfile.email || "No email available"}
          </p>
        </div>
      </div>

      {/* Team Members */}
      <section className="mt-12">
        <h1 className="text-2xl md:text-3xl text-center font-semibold text-indigo-700">
          Team Members
        </h1>
        {userProfile.team?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-6">
            {userProfile.team.map((member) => (
              <div key={member._id} className="card image-full shadow-xl">
                <figure>
                  <img
                    src={
                      member.image
                        ? `${
                            import.meta.env.VITE_BACKEND_URL
                          }/${member.image.replace(/^src\//, "")}`
                        : "/default-profile.png"
                    }
                    alt={member.name || "Team Member"}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-2xl font-bold text-primary">
                    {member.name || "Unnamed Member"}
                  </h2>
                  <p>{member.role || "Role not specified"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No team members found.
          </p>
        )}
      </section>

      {/* Published Blogs */}
      <h1 className="text-2xl md:text-3xl text-center font-semibold mt-12 text-indigo-700">
        Published Blogs
      </h1>
      {userProfile?.author?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mt-8">
          {userProfile.author.map((blog) => (
            <div
              key={blog._id}
              className="card bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
            >
              <figure className="relative h-40 w-full overflow-hidden">
                <img
                  src={
                    blog.image
                      ? `${
                          import.meta.env.VITE_BACKEND_URL
                        }/${blog.image.replace(/^src\//, "")}`
                      : "/default-profile.png"
                  }
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-xl font-semibold text-gray-800 mb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {blog.content.length > 200 ? (
                    <>
                      {blog.content.slice(0, 200)}{" "}
                      <Link
                        to={"/blog-data"}
                        state={{ blogId: blog._id }}
                        className="text-indigo-500 hover:text-indigo-700 text-sm font-medium"
                      >
                        ... Read More →
                      </Link>
                    </>
                  ) : (
                    blog.content
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No blogs published yet.
        </p>
      )}
    </div>
  );
}

export default User;
