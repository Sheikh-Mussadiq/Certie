// import { Fragment } from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, Transition } from '@headlessui/react';
// import { ChevronDown, User, Leaf, LogOut } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { motion } from 'framer-motion';

// const ProfileDropdown = () => {
//   const { currentUser, logout } = useAuth();

//   const getInitials = (name) => {
//     return name
//       ?.split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase() || '?';
//   };

//   return (
//     <Menu as="div" className="relative">
//       <Menu.Button className="flex items-center space-x-2 focus:outline-none">
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="relative h-10 w-10 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center border-2 border-primary-200 hover:border-primary-300 transition-colors"
//         >
//           {currentUser?.avatar_url ? (
//             <img
//               src={currentUser.avatar_url}
//               alt={currentUser.full_name}
//               className="h-full w-full object-cover"
//             />
//           ) : (
//             <span className="text-primary-700 font-medium">
//               {getInitials(currentUser?.full_name)}
//             </span>
//           )}
//         </motion.div>
//         <ChevronDown className="h-4 w-4 text-gray-500" />
//       </Menu.Button>

//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//           <Menu.Item>
//             {({ active }) => (
//               <Link
//                 to="/user"
//                 className={`${
//                   active ? 'bg-gray-100' : ''
//                 } flex items-center px-4 py-2 text-sm text-gray-700`}
//               >
//                 <User className="mr-3 h-4 w-4 text-primary-500 " />
//                 Profile
//               </Link>
//             )}
//           </Menu.Item>
//           <Menu.Item>
//             {({ active }) => (
//               <Link
//                 to="/user/plants"
//                 className={`${
//                   active ? 'bg-gray-100' : ''
//                 } flex items-center px-4 py-2 text-sm text-gray-700`}
//               >
//                 <Leaf className="mr-3 h-4 w-4 text-primary-500" />
//                 My Plants
//               </Link>
//             )}
//           </Menu.Item>
//           <Menu.Item>
//             {({ active }) => (
//               <button
//                 onClick={logout}
//                 className={`${
//                   active ? 'bg-gray-100' : ''
//                 } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
//               >
//                 <LogOut className="mr-3 h-4 w-4 text-primary-500" />
//                 Logout
//               </button>
//             )}
//           </Menu.Item>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// }

// export default ProfileDropdown;

"use client";

import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown, User, Leaf, LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const ProfileDropdown = () => {
  const { currentUser, logout } = useAuth();
  const [isHovering, setIsHovering] = useState(false);

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "?"
    );
  };

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className="flex items-center space-x-2 focus:outline-none"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative h-10 w-10 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center border-2 border-primary-200 hover:border-primary-300 transition-colors"
            >
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url || "/placeholder.svg"}
                  alt={currentUser.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-primary-700 font-medium">
                  {getInitials(currentUser?.full_name)}
                </span>
              )}
            </motion.div>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown
                className={`h-4 w-4 ${
                  isHovering || open ? "text-primary-500" : "text-gray-500"
                } transition-colors`}
              />
            </motion.div>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 rounded-xl bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser?.email}
                </p>
              </div>

              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/user"
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center px-4 py-3 text-sm text-gray-700 transition-colors`}
                  >
                    <User className="mr-3 h-5 w-5 text-primary-500" />
                    Profile
                  </Link>
                )}
              </Menu.Item>
              {/* <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/user/plants"
                    className={`${active ? "bg-gray-100" : ""} flex items-center px-4 py-3 text-sm text-gray-700 transition-colors`}
                  >
                    <Leaf className="mr-3 h-5 w-5 text-primary-500" />
                    My Plants
                  </Link>
                )}
              </Menu.Item> */}
              {/* <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/user/custom"
                    className={`${active ? "bg-gray-100" : ""} flex items-center px-4 py-3 text-sm text-gray-700 transition-colors`}
                  >
                    <Settings className="mr-3 h-5 w-5 text-primary-500" />
                    Settings
                  </Link>
                )}
              </Menu.Item> */}

              <div className="border-t border-gray-100 mt-1"></div>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex w-full items-center px-4 py-3 text-sm text-red-600 transition-colors`}
                  >
                    <LogOut className="mr-3 h-5 w-5 text-red-500" />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default ProfileDropdown;
