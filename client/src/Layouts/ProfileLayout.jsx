import { NavLink, Outlet } from "react-router-dom";
import { RiProfileFill } from "react-icons/ri";
import { GiTeamDowngrade } from "react-icons/gi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from ".././Store/AuthStore";
import { LuNotebookPen } from "react-icons/lu";

function ProfileLayout() {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      Swal.fire({
        title: "Success",
        text: "Logout successful",
        icon: "success",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { name: "Profile", icon: <RiProfileFill />, path: "." },
    { name: "Edit-Blogs", icon: <LuNotebookPen />, path: "update-blogs" },
    { name: "Create-Team", icon: <GiTeamDowngrade />, path: "create-team" },
    { name: "Update-Team", icon: <GiTeamDowngrade />, path: "update-team" },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label>
        {/* Page content here */}
        <Outlet />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu mt-16 md:mt-0 gap-12 bg-base-200  -content min-h-full w-64  text-xl">
          {/* Sidebar content here */}
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "text-primary font-semibold text-2xl" : ""
                }
                end={item.path === "."}
              >
                <span className="inline-flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </span>
              </NavLink>
            </li>
          ))}
          <li>
            <button className="btn btn-error text-white" onClick={handleLogout}>
              Logout
            </button>{" "}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileLayout;
