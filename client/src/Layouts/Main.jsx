import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import { useEffect, useState } from "react";
import Footer from "../Components/Footer/Footer";
import { FaAngleDoubleUp } from "react-icons/fa";

function Main() {
  const [marginTop, setMarginTop] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Show/hide button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300); // Show button after 300px
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Custom smooth scroll animation
  const handleScrollToTop = () => {
    const scrollStep = window.scrollY / 20; // Calculate step size based on current scroll position
    const scrollAnimation = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 0) {
        window.scrollTo(0, Math.max(currentScroll - scrollStep, 0));
        requestAnimationFrame(scrollAnimation); // Continue scrolling
      }
    };
    requestAnimationFrame(scrollAnimation); // Start the animation
  };

  return (
    <div className="lg:container mx-2 lg:mx-auto">
      <Navbar onDropdownToggle={setMarginTop} />
      <div
        style={{ marginTop: marginTop ? "100px" : "0" }}
        className="transition-all duration-300 min-h-screen"
      >
        <Outlet />
        {showScrollButton && (
          <div
            onClick={handleScrollToTop}
            className="fixed bottom-5 right-5 cursor-pointer bg-primary p-3 rounded-full shadow-lg hover:bg-info hover:shadow-2xl transition-all duration-300"
          >
            <FaAngleDoubleUp className="text-2xl text-white" />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Main;
