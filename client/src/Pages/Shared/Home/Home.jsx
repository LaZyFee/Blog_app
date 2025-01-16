import Blog from "../Blog/Blog";
import Banner from "./Banner";
import CreatePost from "./CreatePost";
import HomeCarousel from "./HomeCarousel";
import RightCol from "./RightCol/RightCol";

function Home() {
  return (
    <div className="flex flex-col gap-4 mt-5">
      <div data-aos="fade-up">
        <HomeCarousel />
      </div>
      <div data-aos="fade-up">
        <Banner />
      </div>
      <div data-aos="fade-up">
        <CreatePost />
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div data-aos="fade-left">
          {/* Blog Component */}
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
