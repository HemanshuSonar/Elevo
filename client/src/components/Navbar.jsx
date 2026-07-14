import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

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

function Navbar() {
    const { userData } = useSelector((state) => state.user)
    const [showCreditPopup, setShowCreditPopup] = useState(false)
    const [showUserPopup, setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true })
            dispatch(setUserData(null))
            setShowCreditPopup(false)
            setShowUserPopup(false)
            navigate("/")

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='flex justify-center px-4 pt-6 sticky top-0 z-40' style={{ backgroundColor: C.bg }}>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='w-full max-w-6xl px-8 py-4 flex justify-between items-center relative border'
                style={{ backgroundColor: C.bg, borderColor: C.outlineVariant }}
            >
                <div className='flex items-center gap-3 cursor-pointer'>
                    <div className='p-2' style={{ backgroundColor: C.primary, color: C.onPrimary }}>
                        <BsRobot size={18} />
                    </div>
                    <h1 className='hidden md:block text-lg' style={{ fontFamily: "'Libre Caslon Text', serif" }}>Elevo</h1>
                </div>

                <div className='flex items-center gap-6 relative'>
                    <div className='relative'>
                        <button
                            onClick={() => {
                                if (!userData) {
                                    setShowAuth(true)
                                    return;
                                }
                                setShowCreditPopup(!showCreditPopup);
                                setShowUserPopup(false)
                            }}
                            className='flex items-center gap-2 px-4 py-2 text-sm transition-colors'
                            style={{ backgroundColor: C.surfaceContainer, color: C.primary }}
                        >
                            <BsCoin size={18} style={{ color: C.secondary }} />
                            {userData?.credits || 0}
                        </button>

                        {showCreditPopup && (
                            <div
                                className='absolute right-[-50px] mt-3 w-64 border p-5 z-50'
                                style={{ backgroundColor: C.bg, borderColor: C.outlineVariant }}
                            >
                                <p className='text-sm mb-4' style={{ color: C.onSurfaceVariant }}>
                                    Need more credits to continue interviews?
                                </p>
                                <button
                                    onClick={() => navigate("/pricing")}
                                    className='w-full py-2 text-sm font-semibold'
                                    style={{ backgroundColor: C.primary, color: C.onPrimary }}
                                >
                                    Buy more credits
                                </button>
                            </div>
                        )}
                    </div>

                    <div className='relative'>
                        <button
                            onClick={() => {
                                if (!userData) {
                                    setShowAuth(true)
                                    return;
                                }
                                setShowUserPopup(!showUserPopup);
                                setShowCreditPopup(false)
                            }}
                            className='w-9 h-9 flex items-center justify-center font-semibold'
                            style={{ backgroundColor: C.primary, color: C.onPrimary }}
                        >
                            {userData ? userData?.name.slice(0, 1).toUpperCase() : <FaUserAstronaut size={16} />}

                        </button>

                        {showUserPopup && (
                            <div
                                className='absolute right-0 mt-3 w-48 border p-4 z-50'
                                style={{ backgroundColor: C.bg, borderColor: C.outlineVariant }}
                            >
                                <p className='text-sm font-medium mb-1' style={{ color: C.secondary }}>{userData?.name}</p>

                                <button
                                    onClick={() => navigate("/history")}
                                    className='w-full text-left text-sm py-2 transition-colors hover:opacity-70'
                                    style={{ color: C.onSurfaceVariant }}
                                >
                                    Interview History
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className='w-full text-left text-sm py-2 flex items-center gap-2'
                                    style={{ color: "#ba1a1a" }}
                                >
                                    <HiOutlineLogout size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                </div>



            </motion.div>

            {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

        </div>
    )
}

export default Navbar