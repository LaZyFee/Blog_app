import { useState } from "react";
import showToast from "../../../../Utils/ShowToast";

function NewsLetter() {
  const [notifiedEmail, setNotifiedEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (notifiedEmail.trim() === "") {
      showToast("Error", "Email cannot be empty!", "error");
      return;
    }
    showToast("Success", "Your email has been added successfully!", "success");
    setNotifiedEmail("");
  };

  return (
    <div className="bg-base-200 shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">NEWSLETTER</h2>
      <p className="text-sm mb-4">Get notified when a new post is published.</p>
      <div className="space-y-4">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="youremail@example.com"
            className="w-full border mb-3 border-gray-300 rounded-lg p-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={notifiedEmail} // Bind the value to state
            onChange={(e) => setNotifiedEmail(e.target.value)} // Update state on change
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition duration-200"
          >
            NOTIFY ME
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewsLetter;
