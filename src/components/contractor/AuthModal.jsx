import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AuthModal = ({ isOpen, onClose, onLogin, onSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin({ email, password, keepSignedIn })
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-[#FF5436] rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-4">
                C
              </div>
              <h2 className="text-2xl font-semibold mb-2">Sign In to Complete Booking</h2>
              <p className="text-sm text-center text-gray-600">
                Login with your email and password you have been created before,
                <br />or you can create account if you don't have a Certie account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Keep me signed in</span>
                </label>
                <button type="button" className="text-sm text-primary-orange">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#151718] text-white py-3 rounded-md font-medium hover:bg-black transition-colors"
              >
                Login now
              </button>

              <div className="relative text-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative bg-white px-4 text-sm text-gray-500">Or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center py-2.5 border border-grey-outline rounded-md hover:bg-gray-50"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center py-2.5 border border-grey-outline rounded-md hover:bg-gray-50"
                >
                  <img
                    src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                    alt="Facebook"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-sm font-medium">Facebook</span>
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSignup}
                  className="text-primary-orange font-medium hover:underline"
                >
                  Create account
                </button>
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal