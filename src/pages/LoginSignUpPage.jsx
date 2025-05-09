"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AuthForm from "../components/auth/AuthForm"
import { useAuth } from "../context/AuthContext"
import { Leaf } from 'lucide-react'
import LandingPage from "./LandingPage"
import { TbLeaf2 } from "react-icons/tb";
import { LiaCanadianMapleLeaf } from "react-icons/lia";
import { GiOakLeaf } from "react-icons/gi";
import { IoLeafOutline } from "react-icons/io5";
const LoginSignUpPage = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading to show animation
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isAuthenticated) {
    return <LandingPage />
  }

  // Animated background elements (leaves)
  const leaves = Array(8).fill(null)

  // Create array of leaf components
  const leafComponents = [
    Leaf,
    TbLeaf2,
    LiaCanadianMapleLeaf,
    GiOakLeaf,
    IoLeafOutline
  ];

  // Get random leaf component
  const getRandomLeaf = () => {
    const RandomLeafComponent = leafComponents[Math.floor(Math.random() * leafComponents.length)];
    return <RandomLeafComponent className={`w-12 h-12 text-primary-${300 + (Math.floor(Math.random() * 3)) * 100}`} />;
  };
  
  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Animated background elements */}
      {leaves.map((_, index) => (
        <motion.div
          key={index}
          className="absolute opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -100,
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random() * 1.5,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: Math.random() * 360,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 15 + Math.random() * 30,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20,
          }}
        >
          {getRandomLeaf()}
        </motion.div>
      ))}

      {/* Loading animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1}}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5, repeat: 1, repeatType: "reverse" }}
              className="flex flex-col items-center"
            >
              <Leaf className="h-16 w-16 text-primary-500" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-1 bg-primary-500 mt-4 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Section - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block lg:w-1/2 lg:fixed lg:left-0 lg:top-0 lg:bottom-0 overflow-hidden"
        >
          <div className="relative h-full w-full">
            <motion.img
              src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02"
              alt="Plant background"
              className="h-full w-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-primary-800/30 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
            
            {/* Animated elements on the image */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                  style={{
                    width: 20 + Math.random() * 100,
                    height: 20 + Math.random() * 100,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 1.1, 1],
                    opacity: [0, 0.2, 0.3, 0],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 6,
                    repeat: Infinity,
                    delay: Math.random() * 10,
                  }}
                />
              ))}
            </div>
            
            <div className="absolute bottom-8 left-8 text-white z-10">
              <motion.h1 
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                FloraSense
              </motion.h1>
              <motion.p 
                className="text-lg text-primary-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Nurture your green companions
              </motion.p>
              
              <motion.div 
                className="mt-6 flex space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {["Identify", "Learn", "Grow"].map((text, index) => (
                  <motion.span 
                    key={text}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {text}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full lg:w-1/2 min-h-screen lg:ml-auto"
        >
          <div className="w-full min-h-screen flex items-center justify-center p-6">
            <AuthForm onAuthenticated={() => setIsAuthenticated(true)} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginSignUpPage
