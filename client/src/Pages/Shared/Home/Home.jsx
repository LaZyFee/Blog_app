import React, { Suspense } from "react";

const Blog = React.lazy(() => import("../Blog/Blog"));
const Banner = React.lazy(() => import("./Banner"));
const CreatePost = React.lazy(() => import("./CreatePost"));
const HomeCarousel = React.lazy(() => import("./HomeCarousel"));
const RightCol = React.lazy(() => import("./RightCol/RightCol"));

function Home() {
  return (
    <div className="flex flex-col gap-4 mt-5">
      <div data-aos="fade-up">
        <Suspense fallback={<div>Loading Carousel...</div>}>
          <HomeCarousel />
        </Suspense>
      </div>
      <div data-aos="fade-up">
        <Suspense fallback={<div>Loading Banner...</div>}>
          <Banner />
        </Suspense>
      </div>
      <div data-aos="fade-up">
        <Suspense fallback={<div>Loading Post Creation...</div>}>
          <CreatePost />
        </Suspense>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div data-aos="fade-left">
          <Suspense fallback={<div>Loading Blog...</div>}>
            <Blog />
          </Suspense>
        </div>
        <div data-aos="fade-right">
          <Suspense fallback={<div>Loading Sidebar...</div>}>
            <RightCol />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Home;
