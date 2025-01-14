import { FaCode, FaMobileAlt, FaPaintBrush, FaDatabase } from "react-icons/fa";

const Service = () => {
  const services = [
    {
      icon: <FaCode className="text-5xl text-blue-500" />,
      title: "Web Development",
      description:
        "Building responsive and dynamic websites tailored to your needs using modern web technologies.",
    },
    {
      icon: <FaMobileAlt className="text-5xl text-green-500" />,
      title: "Mobile Development",
      description:
        "Creating user-friendly and performance-optimized mobile applications for iOS and Android.",
    },
    {
      icon: <FaPaintBrush className="text-5xl text-pink-500" />,
      title: "UI/UX Design",
      description:
        "Designing intuitive and visually stunning interfaces for web and mobile platforms.",
    },
    {
      icon: <FaDatabase className="text-5xl text-purple-500" />,
      title: "Backend Development",
      description:
        "Developing robust server-side solutions with secure and scalable architectures.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 rounded-3xl py-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
        <p className="text-lg text-gray-600">
          Explore the wide range of services we offer to help your business
          thrive.
        </p>
      </div>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            <div className="flex justify-center mb-4">{service.icon}</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
              {service.title}
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {service.description}
            </p>
            <div className="text-center">
              <button className="btn bg-primary text-white rounded-full px-6 py-2">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
