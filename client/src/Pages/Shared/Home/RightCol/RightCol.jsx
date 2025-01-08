import ArchiveSection from "./ArchiveSection";
import Category from "./Category";
import NewsLetter from "./NewsLetter";
import Tags from "./Tags";

function RightCol() {
  return (
    <div className="hidden md:flex flex-col space-y-6 bg-gray-100 p-4 rounded-lg">
      <Category />
      <NewsLetter />
      <ArchiveSection />
      <Tags />
    </div>
  );
}

export default RightCol;
