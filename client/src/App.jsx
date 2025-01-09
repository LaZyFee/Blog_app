import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/router";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  useEffect(() => {
    // Initialize AOS once
    AOS.init({
      duration: 800,
      offset: 200,
      once: false,
    });

    // Refresh animations if needed
    AOS.refresh();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
