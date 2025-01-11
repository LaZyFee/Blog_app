/*eslint-disable*/
import { FiMenu } from "react-icons/fi";
import {
  FaFacebookSquare,
  FaYoutubeSquare,
  FaSearch,
  FaHome,
  FaUserEdit,
  FaUser,
  FaBlog,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { FaSquareGooglePlus } from "react-icons/fa6";
import { GrContact, GrServices } from "react-icons/gr";
import { FcAbout } from "react-icons/fc";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../Store/AuthStore";

function Navbar({ onDropdownToggle }) {
  const [theme, setTheme] = useState("nord");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuth();

  // Update the theme on initial load and whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "nord" ? "night" : "nord");
  };

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "About", icon: <FcAbout />, path: "/about" },
    { name: "Blogs", icon: <FaBlog />, path: "/blog" },
    { name: "Service", icon: <GrServices />, path: "/service" },
    { name: "Contact Us", icon: <GrContact />, path: "/contact" },
    ...(user
      ? [{ name: "Profile", icon: <FaUserEdit />, path: "/profile" }]
      : [{ name: "Login", icon: <FaUser />, path: "/login" }]),
  ];
  return (
    <div className="navbar bg-base-100 text-base-100-content shadow-md">
      <div className="flex justify-between">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-x-2 mx-2 cursor-pointer"
              onClick={() => {
                const newState = !dropdownOpen;
                setDropdownOpen(newState);
                onDropdownToggle(newState);
              }}
            >
              <FiMenu className="text-orange-400 text-lg" />
              <span className="text-sm font-semibold hidden md:block">
                MENU
              </span>
            </div>
            {dropdownOpen && (
              <div
                className={`dropdown-content ${
                  dropdownOpen
                    ? "absolute top-full left-0 w-screen z-50 bg-base-100 lg:relative lg:mx-auto"
                    : ""
                } container mx-auto bg-base-100`}
                onClick={() => {
                  setDropdownOpen(false);
                  onDropdownToggle(false);
                }}
              >
                <ul
                  tabIndex={1}
                  className="mt-7 p-2 shadow bg-base-100 flex flex-col lg:flex-row justify-between border-t-2 border-orange-500 me-5"
                >
                  <div className="flex lg:hidden items-center my-2 container mx-auto justify-evenly">
                    <Link to="https://www.facebook.com/rabiulhasan.rafee">
                      <FaFacebookSquare className="text-2xl text-slate-500 hover:text-primary" />
                    </Link>
                    <Link
                      to={"https://www.linkedin.com/in/rabiul-rafee-361224183/"}
                    >
                      <FaLinkedin className="text-2xl text-slate-500 hover:text-primary" />
                    </Link>

                    <Link to="https://github.com/LaZyFee">
                      <FaGithub className="text-2xl text-slate-500 hover:text-primary" />
                    </Link>
                    <Link to="https://www.youtube.com/@lazyfee4473">
                      <FaYoutubeSquare className="text-2xl text-slate-500 hover:text-primary" />
                    </Link>
                    <a href="mailto:rhr277@gmail.com">
                      <FaSquareGooglePlus className="text-2xl text-slate-500 hover:text-primary" />
                    </a>
                  </div>
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-red-500 text-white font-semibold py-2 px-4"
                          : "hover:text-primary hover:bg-base-300 py-2 px-4"
                      }
                      end={item.path === "."}
                    >
                      <span className="inline-flex items-center">
                        {item.icon}
                        <span className="ml-2">{item.name}</span>
                      </span>
                    </NavLink>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="divider divider-horizontal" />

        <div className="navbar-center">
          <Link
            to="/"
            className="text-2xl lg:text-5xl font-extrabold text-orange-600"
          >
            BLOG WEB
          </Link>
        </div>
      </div>

      <div className="navbar-end flex items-center gap-4 lg:ml-32">
        {/* Social Icons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="https://www.facebook.com/rabiulhasan.rafee">
            <FaFacebookSquare className="text-2xl text-slate-500 hover:text-primary" />
          </Link>
          <Link to={"https://www.linkedin.com/in/rabiul-rafee-361224183/"}>
            <FaLinkedin className="text-2xl text-slate-500 hover:text-primary" />
          </Link>

          <Link to="https://github.com/LaZyFee">
            <FaGithub className="text-2xl text-slate-500 hover:text-primary" />
          </Link>
          <Link to="https://www.youtube.com/@lazyfee4473">
            <FaYoutubeSquare className="text-2xl text-slate-500 hover:text-primary" />
          </Link>
          <a href="mailto:rhr277@gmail.com">
            <FaSquareGooglePlus className="text-2xl text-slate-500 hover:text-primary" />
          </a>
        </div>

        {/* Theme Toggle */}
        <label className="grid cursor-pointer place-items-center">
          <input
            onChange={toggleTheme}
            checked={theme === "night"}
            type="checkbox"
            className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
          />
          <svg
            className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <svg
            className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>

        {/* Search Button */}
        <button className="btn btn-ghost flex items-center gap-2">
          <span className="text-sm hidden md:block">SEARCH</span>
          <FaSearch className="text-lg text-primary" />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
