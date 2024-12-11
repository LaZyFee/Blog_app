import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import About from "../Pages/Shared/About/About";
import Blog from "../Pages/Shared/Blog/Blog";
import Contact from "../Pages/Shared/Contact/Contact";
import Signup from "../Pages/Authentication/Signup/Signup";
import Login from "../Pages/Authentication/Login/Login";
import Home from "../Pages/Shared/Home/Home";
import Service from "../Pages/Shared/Service/Service";
import NotFound from "../Pages/Shared/NotFound/NotFound";
import Profile from "../Pages/Shared/Profile/Profile";
import ProfileLayout from "../Layouts/ProfileLayout";
import CreateTeam from "../Pages/Shared/Profile/CreateTeam";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/blog", element: <Blog /> },
      { path: "/service", element: <Service /> },
      { path: "/contact", element: <Contact /> },
      {
        path: "/profile",
        element: <ProfileLayout />,
        children: [
          { path: "", element: <Profile /> },
          { path: "create-team", element: <CreateTeam /> },
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "*", element: <NotFound /> },
]);
