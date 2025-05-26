// "use client";

// import { AnimatePresence } from "framer-motion";
// import { useLocation } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const MainLayout = ({ children }) => {
//   const location = useLocation();

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Navbar />
//       <main className="flex-grow">
//         <AnimatePresence mode="wait">{children}</AnimatePresence>
//       </main>
//       {/* <Footer /> */}
//     </div>
//   );
// };

// export default MainLayout;

"use client";

import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      {/* Add left margin equal to sidebar width */}
      <div className="flex-1 flex flex-col ml-64">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
