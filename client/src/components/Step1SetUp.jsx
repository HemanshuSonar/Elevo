import React from 'react'
import { motion } from "motion/react"
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
    FaMicrophoneAlt,
    FaChartLine,
} from "react-icons/fa";
import { useState } from 'react';
import axios from "axios"
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
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
    surfaceContainerLow: "#f5f3f3",
    surfaceContainerHigh: "#eae8e7",
};

function Step1SetUp({ onStart }) {
    const { userData } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);


    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        setAnalyzing(true)

        const formdata = new FormData()
        formdata.append("resume", resumeFile)

        try {
            const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true })

            console.log(result.data)

            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);

            setAnalyzing(false);

        } catch (error) {
            console.log(error)
            setAnalyzing(false);
        }
    }

    const handleStart = async () => {
        setLoading(true)
        try {
            const result = await axios.post(ServerUrl + "/api/interview/generate-questions", { role, experience, mode, resumeText, projects, skills }, { withCredentials: true })
            console.log(result.data)
            if (userData) {
                dispatch(setUserData({ ...userData, credits: result.data.creditsLeft }))
            }
            setLoading(false)
            onStart(result.data)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='min-h-screen flex items-center justify-center px-4' style={{ backgroundColor: C.bg }}>

            <div className='w-full max-w-6xl grid md:grid-cols-2 overflow-hidden border' style={{ borderColor: C.outlineVariant, backgroundColor: C.bg }}>

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='relative p-12 flex flex-col justify-center border-r'
                    style={{ backgroundColor: C.surfaceContainerHigh, borderColor: C.outlineVariant }}>

                    <h2 className="text-3xl md:text-4xl mb-6" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                        Start Your AI Interview
                    </h2>

                    <p className="mb-10 leading-relaxed" style={{ color: C.onSurfaceVariant }}>
                        Practice real interview scenarios powered by AI.
                        Improve communication, technical skills, and confidence.
                    </p>

                    <div className='space-y-5'>

                        {
                            [
                                {
                                    icon: <FaUserTie className="text-xl" style={{ color: C.primary }} />,
                                    text: "Choose Role & Experience",
                                },
                                {
                                    icon: <FaMicrophoneAlt className="text-xl" style={{ color: C.primary }} />,
                                    text: "Smart Voice Interview",
                                },
                                {
                                    icon: <FaChartLine className="text-xl" style={{ color: C.primary }} />,
                                    text: "Performance Analytics",
                                },
                            ].map((item, index) => (
                                <motion.div key={index}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.15 }}
                                    className='flex items-center space-x-4 p-4 border cursor-pointer'
                                    style={{ backgroundColor: C.bg, borderColor: C.outlineVariant }}>
                                    {item.icon}
                                    <span className='font-medium' style={{ color: C.primary }}>{item.text}</span>

                                </motion.div>
                            ))
                        }
                    </div>



                </motion.div>



                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="p-12" style={{ backgroundColor: C.bg }}>

                    <h2 className='text-2xl md:text-3xl mb-8' style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                        Interview Setup
                    </h2>


                    <div className='space-y-6'>

                        <div className='relative'>
                            <FaUserTie className='absolute top-4 left-4' style={{ color: C.onSurfaceVariant }} />

                            <input type='text' placeholder='Enter role'
                                className='w-full pl-12 pr-4 py-3 border outline-none transition'
                                style={{ borderColor: C.outlineVariant, backgroundColor: C.bg, color: C.primary }}
                                onChange={(e) => setRole(e.target.value)} value={role} />
                        </div>


                        <div className='relative'>
                            <FaBriefcase className='absolute top-4 left-4' style={{ color: C.onSurfaceVariant }} />

                            <input type='text' placeholder='Experience (e.g. 2 years)'
                                className='w-full pl-12 pr-4 py-3 border outline-none transition'
                                style={{ borderColor: C.outlineVariant, backgroundColor: C.bg, color: C.primary }}
                                onChange={(e) => setExperience(e.target.value)} value={experience} />



                        </div>

                        <select value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className='w-full py-3 px-4 border outline-none transition'
                            style={{ borderColor: C.outlineVariant, backgroundColor: C.bg, color: C.primary }}>

                            <option value="Technical">Technical Interview</option>
                            <option value="HR">HR Interview</option>

                        </select>

                        {!analysisDone && (
                            <motion.div
                                onClick={() => document.getElementById("resumeUpload").click()}
                                className='border-2 border-dashed p-8 text-center cursor-pointer transition-colors'
                                style={{ borderColor: C.outlineVariant }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.surfaceContainerLow}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>

                                <FaFileUpload className='text-4xl mx-auto mb-3' style={{ color: C.secondary }} />

                                <input type="file"
                                    accept="application/pdf"
                                    id="resumeUpload"
                                    className='hidden'
                                    onChange={(e) => setResumeFile(e.target.files[0])} />

                                <p className='font-medium' style={{ color: C.onSurfaceVariant }}>
                                    {resumeFile ? resumeFile.name : "Click to upload resume (Optional)"}
                                </p>

                                {resumeFile && (
                                    <motion.button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUploadResume()
                                        }}

                                        className='mt-4 px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-90'
                                        style={{ backgroundColor: C.primary, color: C.onPrimary }}>
                                        {analyzing ? "Analyzing..." : "Analyze Resume"}



                                    </motion.button>)}

                            </motion.div>


                        )}

                        {analysisDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='border p-5 space-y-4'
                                style={{ backgroundColor: C.surfaceContainerLow, borderColor: C.outlineVariant }}>
                                <h3 className='text-lg' style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                                    Resume Analysis Result</h3>

                                {projects.length > 0 && (
                                    <div>
                                        <p className='font-medium mb-1' style={{ color: C.primary }}>
                                            Projects:</p>

                                        <ul className='list-disc list-inside space-y-1' style={{ color: C.onSurfaceVariant }}>
                                            {projects.map((p, i) => (
                                                <li key={i}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {skills.length > 0 && (
                                    <div>
                                        <p className='font-medium mb-1' style={{ color: C.primary }}>
                                            Skills:</p>

                                        <div className='flex flex-wrap gap-2'>
                                            {skills.map((s, i) => (
                                                <span key={i} className='px-3 py-1 text-sm border'
                                                    style={{ borderColor: C.outlineVariant, color: C.secondary }}>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        )}


                        <motion.button
                            onClick={handleStart}
                            disabled={!role || !experience || loading}
                            whileHover={{ opacity: 0.9 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full py-3 text-lg font-semibold transition duration-300 disabled:opacity-50'
                            style={{ backgroundColor: C.primary, color: C.onPrimary }}>
                            {loading ? "Starting..." : "Start Interview"}


                        </motion.button>
                    </div>

                </motion.div>
            </div>

        </motion.div>
    )
}

export default Step1SetUp