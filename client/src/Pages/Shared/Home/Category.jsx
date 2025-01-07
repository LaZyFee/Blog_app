import { FaRss } from "react-icons/fa";

const categories = [
  { name: "Artificial Intelligence", count: 3 },
  { name: "Business", count: 1 },
  { name: "Cars", count: 2 },
  { name: "Development", count: 2 },
  { name: "Technology", count: 2 },
  { name: "Traveling", count: 1 },
];
const tags = [
  ".NET",
  "Adventure",
  "AI",
  "Algolia",
  "Audience",
  "Business",
  "C#",
  "California",
  "Copilot",
  "Entrepreneurs",
  "Enzo Ferrari",
  "Ferrari",
  "Future",
  "Generic attributes",
  "Machine learning",
  "National parks",
  "Nature",
  "Podcast",
  "Racing",
  "Robotics",
  "Search",
  "Smart devices",
  "Smart homes",
  "Sports car",
  "Voice assistants",
  "Windows",
];
const Category = () => {
  return (
    <div className="hidden md:flex flex-col space-y-6 bg-gray-100 p-4 rounded-lg">
      {/* Categories Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">CATEGORIES</h2>
        <ul className="space-y-3">
          {categories.map((category, index) => (
            <li
              key={index}
              className="flex items-center text-gray-800 hover:text-orange-500 transition duration-200"
            >
              <FaRss className="text-orange-500 mr-3" />
              <span className="flex-1">{category.name}</span>
              <span className="text-gray-500">({category.count})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">NEWSLETTER</h2>
        <p className="text-gray-600 text-sm mb-4">
          Get notified when a new post is published.
        </p>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="youremail@example.com"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200">
            NOTIFY ME
          </button>
        </div>
      </div>

      {/* Archive Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">ARCHIVE</h2>
        <ul className="text-gray-700 space-y-2">
          <li>
            <strong className="hover:text-orange-500">2023</strong>
          </li>
          <li>
            <strong className="hover:text-orange-500">2024</strong>
          </li>
        </ul>
      </div>
      {/* tags Section */}
      <div className="bg-white shadow-md rounded-lg p-4 w-80">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">TAGS</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-black text-white hover:bg-orange-500 transition duration-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
