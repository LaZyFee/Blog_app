import { useEffect, useState } from "react";
import { useAuth } from "../../../Store/AuthStore";
import { useTeamStore } from "../../../Store/TeamStore";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import UpdateTeamModal from "./UpdateTeamModal";
import Swal from "sweetalert2";
import showToast from "../../../Utils/ShowToast";

function UpdateTeam() {
  const { user } = useAuth();
  const { fetchTeamMembers, teamMembers, removeTeamMember, isLoading, error } =
    useTeamStore();
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchTeamMembers(user._id);
    }
  }, [user, fetchTeamMembers]);

  const handleEditClick = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await removeTeamMember(id);
        showToast("Success", "Team member deleted successfully!", "success");
      } catch (err) {
        showToast(
          "Error",
          "Failed to delete team member. Please try again.",
          "error"
        );
        console.error("Error deleting team member:", err);
      }
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-xl md:text-3xl text-center font-semibold">
        Update Team
      </h1>

      {/* Loading State */}
      {isLoading ? (
        <p className="text-center">Loading team members...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {teamMembers?.length > 0 ? (
            teamMembers.map((member) => (
              <div className="card bg-base-100 shadow-xl" key={member._id}>
                <figure>
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/${member.image}`}
                    alt={`${member.name || "Team Member"}`}
                    className="h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {member.name || "Unnamed Member"}
                  </h2>
                  <p>{member.role || "Role not specified"}</p>
                  <div className="flex justify-between mt-4">
                    <button
                      className="btn bg-primary text-white"
                      onClick={() => handleEditClick(member)}
                    >
                      <FaEdit className="text-lg" />
                    </button>

                    <button
                      onClick={() => handleDelete(member._id)}
                      className="btn bg-red-500 text-white"
                    >
                      <FaTrashAlt className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No team members found.</p>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedMember && (
        <UpdateTeamModal data={selectedMember} onClose={closeModal} />
      )}
    </div>
  );
}

export default UpdateTeam;
