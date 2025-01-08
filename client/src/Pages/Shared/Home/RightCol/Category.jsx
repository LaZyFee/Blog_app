import { FaRss } from "react-icons/fa";

const categories = [
  { name: "Artificial Intelligence", count: 3 },
  { name: "Business", count: 1 },
  { name: "Cars", count: 2 },
  { name: "Development", count: 2 },
  { name: "Technology", count: 2 },
  { name: "Traveling", count: 1 },
];

const Category = () => {
  return (
    <div className="bg-base-200 shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold  mb-4">CATEGORIES</h2>
      <ul className="space-y-3">
        {categories.map((category, index) => (
          <li
            key={index}
            className="flex items-center hover:text-orange-500 transition duration-200"
          >
            <FaRss className="text-orange-500 mr-3" />
            <span className="flex-1">{category.name}</span>
            <span className="">({category.count})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
