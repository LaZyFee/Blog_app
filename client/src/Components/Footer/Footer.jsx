import { Link } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
function Footer() {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Blogs", path: "/blog" },
    { name: "Service", path: "/service" },
    { name: "Contact Us", path: "/contact" },
  ];
  return (
    <footer className="footer footer-center bg-orange-500 text-base-content rounded p-10 mt-10">
      <nav className="grid lg:grid-flow-col grid-flow-row gap-4">
        {menuItems.map((item) => (
          <Link
            className="hover:text-white font-semibold py-2 px-4"
            key={item.name}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <Link to={"https://www.linkedin.com/in/rabiul-rafee-361224183/"}>
            <FaLinkedinIn className="text-2xl hover:text-white" />
          </Link>
          <Link to={"https://www.youtube.com/@lazyfee4473"}>
            <FaYoutube className="text-2xl hover:text-white" />
          </Link>
          <Link to={"https://www.facebook.com/rabiulhasan.rafee"}>
            <FaFacebookF className="text-2xl hover:text-white" />
          </Link>
        </div>
      </nav>
      <aside>
        <p className="text-left">Copyright © 2024 - All right reserved by</p>
        <a
          href="https://github.com/LaZyFee"
          target="_blank"
          className="hover:font-extrabold hover:text-white font-bold text-2xl "
        >
          Rabiul Rafee
        </a>
      </aside>
    </footer>
  );
}

export default Footer;
