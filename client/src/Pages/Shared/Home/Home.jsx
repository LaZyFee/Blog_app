/*eslint-disable*/
import Banner from "./Banner";
import Blog from "./Blog";
import Category from "./Category";
import CreatePost from "./CreatePost";
import HomeCarousel from "./HomeCarousel";

function Home() {
  return (
    <div className="flex flex-col gap-4 min-h-screen mt-5">
      <HomeCarousel />
      {/* <CreatePost /> */}
      <Banner />
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Blog />
        <Category />
      </div>
    </div>
  );
}

export default Home;
