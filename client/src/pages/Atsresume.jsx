import React, { useState } from 'react'
import { motion } from "motion/react"
import { FaArrowLeft, FaFileUpload } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import jsPDF from "jspdf"

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

function AtsResume() {
    const navigate = useNavigate()

    const [targetRole, setTargetRole] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!resumeFile || !targetRole || analyzing) return;
        setAnalyzing(true);
        setError("");

        const formdata = new FormData();
        formdata.append("resume", resumeFile);
        formdata.append("targetRole", targetRole);
        formdata.append("jobDescription", jobDescription);

        try {
            const res = await axios.post(ServerUrl + "/api/interview/ats-score", formdata, { withCredentials: true });
            setResult(res.data);
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.message || "Failed to analyze resume. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    }

    const downloadOptimizedResumePDF = () => {
        if (!result?.optimizedResumeText) return;

        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 18;
        const contentWidth = pageWidth - margin * 2;
        let currentY = margin;

        const sectionHeaders = ["SUMMARY", "SKILLS", "EXPERIENCE", "PROJECTS", "EDUCATION"];

        const lines = result.optimizedResumeText
            .split("\n")
            .map(l => l.trim());

        const ensureSpace = (needed) => {
            if (currentY + needed > pageHeight - margin) {
                doc.addPage();
                currentY = margin;
            }
        };

        lines.forEach((line) => {
            if (line === "") {
                currentY += 4;
                return;
            }

            const isHeader = sectionHeaders.includes(line.toUpperCase());

            if (isHeader) {
                ensureSpace(14);
                currentY += 4;
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.setTextColor(6, 21, 14);
                doc.text(line.toUpperCase(), margin, currentY);
                currentY += 2;
                doc.setDrawColor(6, 21, 14);
                doc.line(margin, currentY, pageWidth - margin, currentY);
                currentY += 6;
            } else {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10.5);
                doc.setTextColor(30, 30, 30);
                const split = doc.splitTextToSize(line, contentWidth);
                ensureSpace(split.length * 5 + 2);
                doc.text(split, margin, currentY);
                currentY += split.length * 5 + 2;
            }
        });

        doc.save(`ATS_Resume_${(targetRole || "role").replace(/\s+/g, "_")}.pdf`);
    };

    const scoreColor = (score) => {
        if (score >= 75) return C.secondary;
        if (score >= 50) return C.primary;
        return "#ba1a1a";
    };

    return (
        <div className='min-h-screen px-4 sm:px-6 lg:px-10 py-10' style={{ backgroundColor: C.bg }}>
            <div className='max-w-5xl mx-auto'>

                <div className='mb-10 flex items-start gap-4 flex-wrap'>
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
                        <h1 className='text-3xl' style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                            ATS Resume Analyzer
                        </h1>
                        <p className='mt-2' style={{ color: C.onSurfaceVariant }}>
                            Score your resume against a role, find missing keywords, and generate an ATS-optimized version.
                        </p>
                    </div>
                </div>

                {/* Input form */}
                <div className='border p-6 sm:p-8 mb-10' style={{ borderColor: C.outlineVariant, backgroundColor: C.bg }}>
                    <div className='space-y-5'>
                        <div>
                            <label className='block text-xs uppercase tracking-widest mb-2' style={{ color: C.secondary }}>
                                Target Role
                            </label>
                            <input
                                type='text'
                                placeholder='e.g. Frontend Developer, Data Analyst'
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className='w-full px-4 py-3 border outline-none transition'
                                style={{ borderColor: C.outlineVariant, backgroundColor: C.bg, color: C.primary }}
                            />
                        </div>

                        <div>
                            <label className='block text-xs uppercase tracking-widest mb-2' style={{ color: C.secondary }}>
                                Job Description (optional)
                            </label>
                            <textarea
                                placeholder='Paste the job description for a more precise match...'
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows={4}
                                className='w-full px-4 py-3 border outline-none transition resize-none'
                                style={{ borderColor: C.outlineVariant, backgroundColor: C.bg, color: C.primary }}
                            />
                        </div>

                        <div
                            onClick={() => document.getElementById("atsResumeUpload").click()}
                            className='border-2 border-dashed p-8 text-center cursor-pointer transition-colors'
                            style={{ borderColor: C.outlineVariant }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.surfaceContainerLow}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            <FaFileUpload className='text-4xl mx-auto mb-3' style={{ color: C.secondary }} />
                            <input
                                type="file"
                                accept="application/pdf"
                                id="atsResumeUpload"
                                className='hidden'
                                onChange={(e) => setResumeFile(e.target.files[0])}
                            />
                            <p className='font-medium' style={{ color: C.onSurfaceVariant }}>
                                {resumeFile ? resumeFile.name : "Click to upload your resume (PDF)"}
                            </p>
                        </div>

                        {error && (
                            <p className='text-sm' style={{ color: "#ba1a1a" }}>{error}</p>
                        )}

                        <motion.button
                            onClick={handleAnalyze}
                            disabled={!resumeFile || !targetRole || analyzing}
                            whileHover={{ opacity: 0.9 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full py-3 text-lg font-semibold transition duration-300 disabled:opacity-50'
                            style={{ backgroundColor: C.primary, color: C.onPrimary }}
                        >
                            {analyzing ? "Analyzing Resume..." : "Analyze Resume"}
                        </motion.button>
                    </div>
                </div>

                {/* Results */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'
                    >
                        {/* Score */}
                        <div className='border p-6 sm:p-8 text-center' style={{ borderColor: C.outlineVariant, backgroundColor: C.bg }}>
                            <h3 className='mb-6 text-sm' style={{ color: C.onSurfaceVariant }}>ATS Match Score</h3>
                            <div className='relative w-28 h-28 mx-auto'>
                                <CircularProgressbar
                                    value={result.atsScore}
                                    text={`${result.atsScore}`}
                                    styles={buildStyles({
                                        textSize: "24px",
                                        pathColor: scoreColor(result.atsScore),
                                        textColor: C.primary,
                                        trailColor: C.surfaceContainer,
                                    })}
                                />
                            </div>
                            <p className='mt-3 text-xs' style={{ color: C.onSurfaceVariant, opacity: 0.7 }}>Out of 100</p>
                            <p className='mt-4 text-sm' style={{ color: C.onSurfaceVariant }}>
                                Targeting: <span style={{ color: C.primary, fontWeight: 600 }}>{result.targetRole}</span>
                            </p>
                        </div>

                        {/* Missing Keywords */}
                        <div className='border p-6 sm:p-8 lg:col-span-2' style={{ borderColor: C.outlineVariant, backgroundColor: C.bg }}>
                            <h3 className='text-base sm:text-lg mb-5' style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                                Missing Keywords
                            </h3>
                            {result.missingKeywords.length > 0 ? (
                                <div className='flex flex-wrap gap-2'>
                                    {result.missingKeywords.map((kw, i) => (
                                        <span
                                            key={i}
                                            className='px-3 py-1 text-sm border'
                                            style={{ borderColor: C.outlineVariant, color: C.secondary }}
                                        >
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-sm' style={{ color: C.onSurfaceVariant }}>
                                    No major keyword gaps found — nice work.
                                </p>
                            )}
                        </div>

                        {/* Section Feedback */}
                        <div className='border p-6 sm:p-8 lg:col-span-3' style={{ borderColor: C.outlineVariant, backgroundColor: C.bg }}>
                            <h3 className='text-base sm:text-lg mb-6' style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                                Section-by-Section Feedback
                            </h3>
                            <div className='space-y-4'>
                                {Object.entries(result.sectionFeedback || {})
                                    .filter(([, feedback]) => feedback && feedback.trim() !== "")
                                    .map(([section, feedback], i) => (
                                        <div key={i} className='p-4 border' style={{ borderColor: C.outlineVariant, backgroundColor: C.surfaceContainerLow }}>
                                            <p className='text-xs uppercase tracking-widest mb-1' style={{ color: C.secondary }}>
                                                {section}
                                            </p>
                                            <p className='text-sm leading-relaxed' style={{ color: C.onSurfaceVariant }}>
                                                {feedback}
                                            </p>
                                        </div>
                                    ))}
                                {Object.values(result.sectionFeedback || {}).every(f => !f || f.trim() === "") && (
                                    <p className='text-sm' style={{ color: C.onSurfaceVariant }}>
                                        Your resume looks solid across all sections.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Download optimized resume */}
                        <div className='border p-6 sm:p-8 lg:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-4' style={{ borderColor: C.outlineVariant, backgroundColor: C.surfaceContainerHigh }}>
                            <div>
                                <h3 className='text-base sm:text-lg mb-1' style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                                    ATS-Optimized Resume
                                </h3>
                                <p className='text-sm' style={{ color: C.onSurfaceVariant }}>
                                    A rewritten version of your resume tailored to this role, ready to download.
                                </p>
                            </div>
                            <button
                                onClick={downloadOptimizedResumePDF}
                                className='px-8 py-3 font-semibold text-sm sm:text-base transition-opacity hover:opacity-90 text-nowrap'
                                style={{ backgroundColor: C.primary, color: C.onPrimary }}
                            >
                                Download PDF
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default AtsResume