'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const router = useRouter()

  // State variables
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [login, setLogin] = useState(false)
  const [profileSrc, setProfileSrc] = useState('')

  // Check if window is available
  const isServer = () => typeof window !== 'undefined'

  // Check login status and set profile image
  const toggleLogin = () => {
    if (isServer()) {
      const email = localStorage.getItem('email')
      const src = localStorage.getItem('src')
      setLogin(!!email)
      setProfileSrc(src || '')
    }
  }

  // Logout function
  const logout = () => {
    if (isServer()) {
      localStorage.removeItem('email')
      localStorage.removeItem('src')
    }
    setLogin(false)
    setProfileSrc('')
    router.push('/')
  }

  // Redirect to login page
  const Login = () => {
    router.push('/login')
  }

  // Run on component mount
  useEffect(() => {
    toggleLogin()
  }, [])

  // Handle mouse events for profile menu
  const handleMouseEnter = () => setIsMenuOpen(true)
  const handleMouseLeave = () => setIsMenuOpen(false)

  return (
    <nav className="bg-black py-3 px-6 flex justify-between items-center">
      {/* Logo */}
      <h1
        className="text-2xl text-white font-semibold cursor-pointer"
        onClick={() => router.push('/')}
      >
        Developer Blogs
      </h1>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-8 text-white font-bold">
        <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => router.push('/')}>Home</li>
        <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => router.push('/browse-blogs')}>Blogs</li>
        <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => login ? router.push('/upload-blog') : router.push('/login')}>Upload Blog</li>
        <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => router.push('/about')}>About Us</li>
        <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => router.push('/contact')}>Contact Us</li>
      </ul>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {console.log(isMobileMenuOpen)}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Profile Menu */}
      <div
        className="relative hidden md:block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {profileSrc ? (
          <img
            src={profileSrc}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700 cursor-pointer"></div>
        )}

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 bg-[#1c1c1e] border border-gray-700 text-white rounded-md shadow-lg p-3 w-56 z-10"
            >
              <ul className="space-y-2">
                <li
                  className="cursor-pointer p-2 rounded-md hover:bg-[#27272a] transition duration-200"
                  onClick={() => login ? router.push('/user-profile') : router.push('/login')}
                >
                  {login ? 'Profile' : 'Login'}
                </li>

                {login && (
                  <li
                    className="cursor-pointer p-2 rounded-md hover:bg-[#27272a] transition duration-200"
                    onClick={() => router.push('/my-blogs')}
                  >
                    My Blogs
                  </li>
                )}

                <li className="cursor-pointer p-2 rounded-md hover:bg-[#27272a] transition duration-200">
                  Settings
                </li>

                <li
                  className="cursor-pointer p-2 rounded-md hover:bg-[#27272a] transition duration-200"
                  onClick={() => login ? logout() : Login()}
                >
                  {login ? 'Logout' : 'Login'}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu List */}
{/* Mobile Menu List */}
{isMobileMenuOpen && (
  <div className="fixed top-0 left-0 w-full h-screen bg-black text-white p-4 md:hidden z-[999]">
    <button
      onClick={() => setIsMobileMenuOpen(false)}
      className="absolute top-4 right-6 text-white text-2xl"
    >
      ✕
    </button>
    <ul className="space-y-6 text-center mt-16 text-xl font-bold">
      <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => { router.push('/'); setIsMobileMenuOpen(false); }}>Home</li>
      <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => { router.push('/browse-blogs'); setIsMobileMenuOpen(false); }}>Blogs</li>
      <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => { login ? router.push('/upload-blog') : router.push('/login'); setIsMobileMenuOpen(false); }}>Upload Blog</li>
      <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => { router.push('/about'); setIsMobileMenuOpen(false); }}>About Us</li>
      <li className="cursor-pointer hover:text-[#58A6FF]" onClick={() => { router.push('/contact'); setIsMobileMenuOpen(false); }}>Contact Us</li>
    </ul>
  </div>
)}


    </nav>
  )
}

export default Navbar
