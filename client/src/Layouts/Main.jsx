import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import { useState } from "react";

function Main() {
  const [marginTop, setMarginTop] = useState(false);

  return (
    <div className="container mx-auto">
      <Navbar onDropdownToggle={setMarginTop} />
      <div
        style={{ marginTop: marginTop ? "100px" : "0" }}
        className="transition-all duration-300"
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Main;
