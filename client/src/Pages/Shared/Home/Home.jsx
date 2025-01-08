/* eslint-disable */
import { useEffect } from "react";
import Blog from "../Blog/Blog";
import Banner from "./Banner";
import CreatePost from "./CreatePost";
import HomeCarousel from "./HomeCarousel";
import RightCol from "./RightCol/RightCol";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      offset: 200,
      once: false,
    });

    // Refresh AOS animations on component updates
    AOS.refresh();
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-5">
      <HomeCarousel />
      {/* <CreatePost /> */}
      <div data-aos="fade-up">
        <Banner />
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div data-aos="fade-left">
          <Blog />
        </div>
        <div data-aos="fade-right">
          <RightCol />
        </div>
      </div>
    </div>
  );
}

export default Home;
