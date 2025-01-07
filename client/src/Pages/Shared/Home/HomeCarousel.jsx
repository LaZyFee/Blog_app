import { useState, useEffect } from "react";

const categories = [
  {
    name: "Technology",
    image:
      "https://plus.unsplash.com/premium_photo-1683120972279-87efe2ba252f?q=80&w=1563&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Stay updated with the latest in tech.",
  },
  {
    name: "Science",
    image:
      "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Explore discoveries and innovations in science.",
  },
  {
    name: "Artificial Intelligence",
    image:
      "https://images.unsplash.com/photo-1625314868143-20e93ce3ff33?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Dive into the world of AI and machine learning.",
  },
  {
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1593013820725-ca0b6076576f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Catch up with the latest in sports.",
  },
  {
    name: "Health",
    image:
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Learn about health and wellness tips.",
  },
  {
    name: "Education",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Discover trends and insights in education.",
  },
];

function HomeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
  };

  // Auto-play carousel using useEffect
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {/* Carousel Items */}
      {categories.map((category, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
            index === currentIndex ? "translate-x-0" : "translate-x-full"
          } ${index < currentIndex ? "-translate-x-full" : ""}`}
        >
          {/* Background Image */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${category.image})` }}
          >
            {/* Overlay */}
            <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center">
              <div className="text-center text-white px-4 md:px-8">
                <h2 className="text-3xl md:text-5xl font-bold">
                  {category.name}
                </h2>
                <p className="mt-4 text-lg md:text-xl">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={() =>
          setCurrentIndex(
            currentIndex === 0 ? categories.length - 1 : currentIndex - 1
          )
        }
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
      >
        &#10094; {/* Left Arrow */}
      </button>
      <button
        onClick={() => nextSlide()}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
      >
        &#10095; {/* Right Arrow */}
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {categories.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default HomeCarousel;
