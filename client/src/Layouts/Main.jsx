import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import { useState } from "react";
import Footer from "../Components/Footer/Footer";

function Main() {
  const [marginTop, setMarginTop] = useState(false);

  return (
    <div className="lg:container mx-2 lg:mx-auto">
      <Navbar onDropdownToggle={setMarginTop} />
      <div
        style={{ marginTop: marginTop ? "100px" : "0" }}
        className="transition-all duration-300  min-h-screen"
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Main;
