import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import myImage from "../../../assets/myImage.jpg";

const About = () => {
  return (
    <div
      className="min-h-screen hero lg:my-10 bg-gradient-to-br from-gray-100 to-gray-300"
      style={{ padding: "2rem" }}
    >
      <div className="hero-content flex-col lg:flex-row-reverse items-center justify-center shadow-lg rounded-3xl bg-white p-8 lg:p-16">
        <img
          src={myImage}
          className="lg:max-w-sm rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
          alt="Rabiul Hasan Rafee"
        />

        <div className="lg:w-2/3 mx-auto text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-4">
            Hello, I&apos;m{" "}
            <span className="text-red-600 underline decoration-wavy">
              Rabiul Hasan Rafee
            </span>
          </h1>

          {/* Enhanced Paragraph Section */}
          <p className="py-6 text-gray-700 text-lg leading-7">
            <span>
              I’m a passionate full-stack developer specializing in the{" "}
              <strong className="text-blue-500">MERN stack</strong>, with over 1
              year of experience building dynamic and responsive web
              applications.
            </span>
            <br />
            <span>
              Proficient in{" "}
              <strong className="text-green-600">
                MongoDB, Express, React,
              </strong>{" "}
              and <strong className="text-green-600">Node.js</strong>, I create
              seamless user interfaces, manage complex state effectively, and
              ensure high-performing backend systems.
            </span>
            <br />
            <span>
              I’m highly skilled in frontend development, using advanced state
              management tools like{" "}
              <strong className="text-purple-600">Redux</strong>,{" "}
              <strong className="text-purple-600">Zustand</strong>, and{" "}
              <strong className="text-purple-600">Context API</strong> to
              maintain smooth and efficient user experiences.
            </span>
            <br />
            <span>
              <strong>Let’s connect!</strong> Reach out if you’d like to discuss
              how I can contribute to your next project with the latest
              technologies and best practices.
            </span>
          </p>

          {/* Social Links */}
          <div className="flex gap-6 items-center justify-center lg:justify-start mb-8">
            <Link to="mailto:your.email@example.com">
              <MdEmail className="text-4xl text-red-500 hover:text-red-700 transition-colors duration-300" />
            </Link>
            <Link
              to="https://www.linkedin.com/in/rabiul-rafee-361224183/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="text-4xl text-blue-500 hover:text-blue-700 transition-colors duration-300" />
            </Link>
            <Link
              to="https://github.com/LaZyFee"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="text-4xl text-gray-600 hover:text-gray-800 transition-colors duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
