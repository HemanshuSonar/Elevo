import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'

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
};

function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })

                setInterviews(result.data)

            } catch (error) {
                console.log(error)
            }

        }

        getMyInterviews()

    }, [])


    return (
        <div className='min-h-screen py-10' style={{ backgroundColor: C.bg }}>
            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>

                <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
                    <button
                        onClick={() => navigate("/")}
                        className='mt-1 p-3 border transition-colors'
                        style={{ borderColor: C.outlineVariant }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.surfaceContainer}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <FaArrowLeft style={{ color: C.primary }} />
                    </button>

                    <div>
                        <h1
                            className='text-3xl flex-nowrap'
                            style={{ fontFamily: "'Libre Caslon Text', serif" }}
                        >
                            Interview History
                        </h1>
                        <p className='mt-2' style={{ color: C.onSurfaceVariant }}>
                            Track your past interviews and performance reports
                        </p>

                    </div>
                </div>


                {interviews.length === 0 ?
                    <div className='p-10 border text-center' style={{ borderColor: C.outlineVariant }}>
                        <p style={{ color: C.onSurfaceVariant }}>
                            No interviews found. Start your first interview.
                        </p>

                    </div>

                    :

                    <div className='grid gap-6'>
                        {interviews.map((item, index) => (
                            <div key={index}
                                onClick={() => navigate(`/report/${item._id}`)}
                                className='p-6 border transition-colors duration-300 cursor-pointer'
                                style={{ borderColor: C.outlineVariant }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.surfaceContainerLow}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div>
                                        <h3
                                            className="text-lg"
                                            style={{ fontFamily: "'Libre Caslon Text', serif" }}
                                        >
                                            {item.role}
                                        </h3>

                                        <p className="text-sm mt-1" style={{ color: C.onSurfaceVariant }}>
                                            {item.experience} • {item.mode}
                                        </p>

                                        <p className="text-xs mt-2" style={{ color: C.onSurfaceVariant, opacity: 0.7 }}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-6'>

                                        {/* SCORE */}
                                        <div className="text-right">
                                            <p className="text-xl" style={{ fontFamily: "'Libre Caslon Text', serif", color: C.secondary }}>
                                                {item.finalScore || 0}/10
                                            </p>
                                            <p className="text-xs" style={{ color: C.onSurfaceVariant, opacity: 0.7 }}>
                                                Overall Score
                                            </p>
                                        </div>

                                        {/* STATUS BADGE */}
                                        <span
                                            className="px-4 py-1 text-xs font-medium uppercase tracking-wider border"
                                            style={
                                                item.status === "completed"
                                                    ? { backgroundColor: C.primary, color: C.onPrimary, borderColor: C.primary }
                                                    : { backgroundColor: "transparent", color: C.secondary, borderColor: C.secondary }
                                            }
                                        >
                                            {item.status}
                                        </span>


                                    </div>
                                </div>

                            </div>

                        ))
                        }

                    </div>
                }
            </div>

        </div>
    )
}

export default InterviewHistory