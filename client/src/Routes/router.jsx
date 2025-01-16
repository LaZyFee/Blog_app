import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../Layouts/Main";
import ProfileLayout from "../Layouts/ProfileLayout";

const Home = React.lazy(() => import("../Pages/Shared/Home/Home"));
const About = React.lazy(() => import("../Pages/Shared/About/About"));
const Blog = React.lazy(() => import("../Pages/Shared/Blog/Blog"));
const Service = React.lazy(() => import("../Pages/Shared/Service/Service"));
const Contact = React.lazy(() => import("../Pages/Shared/Contact/Contact"));
const User = React.lazy(() => import("../Pages/Shared/User/User"));
const DetailsBlog = React.lazy(() =>
  import("../Pages/Shared/Blog/DetailsBlog")
);
const CreateBlog = React.lazy(() => import("../Pages/Shared/Blog/CreateBlog"));
const Profile = React.lazy(() => import("../Pages/Shared/Profile/Profile"));
const UpdateBlog = React.lazy(() => import("../Pages/Shared/Blog/UpdateBlog"));
const CreateTeam = React.lazy(() => import("../Pages/Shared/Team/CreateTeam"));
const UpdateTeam = React.lazy(() => import("../Pages/Shared/Team/UpdateTeam"));
const Login = React.lazy(() => import("../Pages/Authentication/Login/Login"));
const Signup = React.lazy(() =>
  import("../Pages/Authentication/Signup/Signup")
);
const NotFound = React.lazy(() => import("../Pages/Shared/NotFound/NotFound"));

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
      { path: "/user", element: <User /> },
      { path: "/blog-data", element: <DetailsBlog /> },
      { path: "/create-blog", element: <CreateBlog /> },
      {
        path: "/profile",
        element: <ProfileLayout />,
        children: [
          { path: "", element: <Profile /> },
          { path: "update-blogs", element: <UpdateBlog /> },
          { path: "create-team", element: <CreateTeam /> },
          { path: "update-team", element: <UpdateTeam /> },
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "*", element: <NotFound /> },
]);
