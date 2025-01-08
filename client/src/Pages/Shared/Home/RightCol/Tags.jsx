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
function Tags() {
  return (
    <div className="bg-base-200 shadow-md rounded-lg p-4 w-80">
      <h2 className="text-lg font-semibold   mb-4">TAGS</h2>
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
  );
}

export default Tags;
