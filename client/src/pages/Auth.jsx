import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

// Elevo design tokens (literal hex values so no tailwind.config changes are required)
const C = {
  bg: "#fbf9f8",
  primary: "#06150e",
  onPrimary: "#ffffff",
  secondary: "#755939",
  outlineVariant: "#c3c8c3",
  onSurfaceVariant: "#434844",
  surfaceContainer: "#efeded",
};

function Auth({ isModel = false }) {
  const dispatch = useDispatch()

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      let User = response.user
      let name = User.displayName
      let email = User.email
      const result = await axios.post(ServerUrl + "/api/auth/google", { name, email }, { withCredentials: true })
      dispatch(setUserData(result.data))



    } catch (error) {
      console.log(error)
      dispatch(setUserData(null))
    }
  }
  return (
    <div
      className={`w-full ${isModel ? "py-4" : "min-h-screen flex items-center justify-center px-6 py-20"}`}
      style={isModel ? {} : { backgroundColor: C.bg }}
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className={`w-full border ${isModel ? "max-w-md p-8" : "max-w-lg p-12"}`}
        style={{ backgroundColor: C.bg, borderColor: C.outlineVariant }}
      >
        <div className='flex items-center justify-center gap-3 mb-6'>
          <div className='p-2' style={{ backgroundColor: C.primary, color: C.onPrimary }}>
            <BsRobot size={18} />
          </div>
          <h2 className='text-lg' style={{ fontFamily: "'Libre Caslon Text', serif" }}>Elevo</h2>
        </div>

        <h1
          className='text-2xl md:text-3xl text-center leading-snug mb-4'
          style={{ fontFamily: "'Libre Caslon Text', serif" }}
        >
          Continue with{" "}
          <span
            className='italic font-normal inline-flex items-center gap-2'
            style={{ color: C.secondary }}
          >
            <IoSparkles size={16} />
            AI Smart Interview
          </span>
        </h1>

        <p
          className='text-center text-sm md:text-base leading-relaxed mb-8'
          style={{ color: C.onSurfaceVariant }}
        >
          Sign in to start AI-powered mock interviews,
          track your progress, and unlock detailed performance insights.
        </p>

        <motion.button
          onClick={handleGoogleAuth}
          whileHover={{ opacity: 0.9 }}
          whileTap={{ opacity: 1, scale: 0.98 }}
          className='w-full flex items-center justify-center gap-3 py-3 text-sm font-semibold tracking-wide'
          style={{ backgroundColor: C.primary, color: C.onPrimary }}
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Auth