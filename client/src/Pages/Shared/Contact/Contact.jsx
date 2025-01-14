import { CiLocationOn, CiMail, CiPhone } from "react-icons/ci";

function Contact() {
  return (
    <div className="bg-base-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-10">Contact Us</h2>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-base-200 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold  mb-6">Get In Touch</h3>
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-base-200 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold  mb-6">Our Office</h3>
              <p className="">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                quis quam at tortor facilisis tristique.
              </p>
              <div className="mt-6">
                <p className="flex items-center  mb-4">
                  <CiLocationOn />
                  Bahaddarhat, Chittagong, Bangladesh
                </p>
                <p className="flex items-center  mb-4">
                  <CiPhone />
                  Phone: 01636-000000
                </p>
                <p className="flex items-center ">
                  <CiMail />
                  Email: rhr277@gmail.com
                </p>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-base-200 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold  mb-6">Find Us Here</h3>
              <div className="relative pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.573620580503!2d91.84162477454248!3d22.36972292963672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad2777c9c1cf83%3A0xb8796c419fa1021b!2sBahaddarhat%2C%20Chittagong!5e0!3m2!1sen!2sbd!4v1736787997268!5m2!1sen!2sbd"
                  width="600"
                  height="450"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
