import React from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModel from '../components/AuthModel';
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';

// Elevo design tokens (kept as literal hex values so no tailwind.config changes are required)
const C = {
  bg: "#fbf9f8",
  primary: "#06150e",
  onPrimary: "#ffffff",
  secondary: "#755939",
  onSecondaryContainer: "#785b3c",
  outlineVariant: "#c3c8c3",
  onSurfaceVariant: "#434844",
  surfaceContainer: "#efeded",
  surfaceContainerLow: "#f5f3f3",
  surfaceContainerHigh: "#eae8e7",
};

function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()

  const requireAuth = (path) => {
    if (!userData) {
      setShowAuth(true)
      return;
    }
    navigate(path)
  }

  return (
    <div className='min-h-screen flex flex-col' style={{ backgroundColor: C.bg, color: C.primary }}>
      <Navbar />

      <main className='flex-1 max-w-[1280px] w-full mx-auto px-6 md:px-16 pt-20 pb-10'>

        {/* Hero */}
        <section className='flex flex-col items-center text-center mb-24'>
          <div
            className='inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full'
            style={{ backgroundColor: C.surfaceContainer }}
          >
            <span className='w-2 h-2 rounded-full animate-pulse' style={{ backgroundColor: C.secondary }}></span>
            <span
              className='text-xs uppercase tracking-widest font-medium'
              style={{ color: C.secondary }}
            >
              AI Powered Smart Interview Platform
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='max-w-4xl mb-8 leading-tight text-4xl md:text-6xl'
            style={{ fontFamily: "'Libre Caslon Text', serif", letterSpacing: "-0.02em" }}
          >
            Practice Interviews with <br className='hidden md:block' />
            <span className='italic font-normal'>AI Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='max-w-2xl mb-12 text-lg leading-relaxed'
            style={{ color: C.onSurfaceVariant }}
          >
            Role-based mock interviews with smart follow-ups, adaptive difficulty
            and real-time performance evaluation.
          </motion.p>

          <div className='flex flex-col sm:flex-row gap-4'>
            <motion.button
              onClick={() => requireAuth("/interview")}
              whileHover={{ opacity: 0.9 }}
              whileTap={{ opacity: 1, scale: 0.98 }}
              className='px-10 py-4 text-sm font-semibold tracking-wide transition-opacity shadow-lg'
              style={{ backgroundColor: C.primary, color: C.onPrimary }}
            >
              Start Interview
            </motion.button>

            <motion.button
              onClick={() => requireAuth("/history")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className='px-10 py-4 text-sm font-semibold tracking-wide border transition-colors'
              style={{ borderColor: C.primary, color: C.primary }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.surfaceContainer}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              View History
            </motion.button>
          </div>
        </section>

        {/* Step-by-step process (editorial cards, no rotation gimmicks — replaced with clean numbered rule) */}
        <section className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-28'>
          {
            [
              {
                icon: <BsRobot size={22} />,
                step: "01",
                title: "Role & Experience Selection",
                desc: "AI adjusts difficulty based on selected job role."
              },
              {
                icon: <BsMic size={22} />,
                step: "02",
                title: "Smart Voice Interview",
                desc: "Dynamic follow-up questions based on your answers."
              },
              {
                icon: <BsClock size={22} />,
                step: "03",
                title: "Timer Based Simulation",
                desc: "Real interview pressure with time tracking."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 + index * 0.15 }}
                className='p-8 flex flex-col justify-between border'
                style={{ borderColor: C.outlineVariant }}
              >
                <div>
                  <div className='mb-6' style={{ color: C.primary }}>{item.icon}</div>
                  <span
                    className='block text-xs font-semibold tracking-[0.2em] mb-3'
                    style={{ color: C.secondary }}
                  >
                    STEP {item.step}
                  </span>
                  <h3
                    className='text-xl mb-3'
                    style={{ fontFamily: "'Libre Caslon Text', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className='text-sm leading-relaxed' style={{ color: C.onSurfaceVariant }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))
          }
        </section>

        {/* Advanced AI Capabilities */}
        <section className='mb-28'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-16 text-3xl md:text-4xl'
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Advanced AI <span className='italic' style={{ color: C.secondary }}>Capabilities</span>
          </motion.h2>

          <div className='grid md:grid-cols-2 gap-10'>
            {
              [
                {
                  image: evalImg,
                  icon: <BsBarChart size={18} />,
                  title: "AI Answer Evaluation",
                  desc: "Scores communication, technical accuracy and confidence."
                },
                {
                  image: resumeImg,
                  icon: <BsFileEarmarkText size={18} />,
                  title: "Resume Based Interview",
                  desc: "Project-specific questions based on uploaded resume."
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkText size={18} />,
                  title: "Downloadable PDF Report",
                  desc: "Detailed strengths, weaknesses and improvement insights."
                },
                {
                  image: analyticsImg,
                  icon: <BsBarChart size={18} />,
                  title: "History & Analytics",
                  desc: "Track progress with performance graphs and topic analysis."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className='p-8 border transition-colors'
                  style={{ borderColor: C.outlineVariant }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.surfaceContainerLow}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div className='flex flex-col md:flex-row items-center gap-8'>
                    <div className='w-full md:w-1/2 flex justify-center'>
                      <img src={item.image} alt={item.title} className='w-full h-auto object-contain max-h-64 grayscale' />
                    </div>

                    <div className='w-full md:w-1/2'>
                      <div className='mb-6' style={{ color: C.primary }}>{item.icon}</div>
                      <h3
                        className='text-xl mb-3'
                        style={{ fontFamily: "'Libre Caslon Text', serif" }}
                      >
                        {item.title}
                      </h3>
                      <p className='text-sm leading-relaxed' style={{ color: C.onSurfaceVariant }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </section>

        {/* Multiple Interview Modes */}
        <section className='mb-28'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-16 text-3xl md:text-4xl'
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Multiple Interview <span className='italic' style={{ color: C.secondary }}>Modes</span>
          </motion.h2>

          <div className='grid md:grid-cols-2 gap-10'>
            {
              [
                {
                  img: hrImg,
                  title: "HR Interview Mode",
                  desc: "Behavioral and communication based evaluation."
                },
                {
                  img: techImg,
                  title: "Technical Mode",
                  desc: "Deep technical questioning based on selected role."
                },
                {
                  img: confidenceImg,
                  title: "Confidence Detection",
                  desc: "Basic tone and voice analysis insights."
                },
                {
                  img: creditImg,
                  title: "Credits System",
                  desc: "Unlock premium interview sessions easily."
                }
              ].map((mode, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className='p-8 border'
                  style={{ borderColor: C.outlineVariant }}
                >
                  <div className='flex items-center justify-between gap-6'>
                    <div className="w-1/2">
                      <h3
                        className="text-xl mb-3"
                        style={{ fontFamily: "'Libre Caslon Text', serif" }}
                      >
                        {mode.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: C.onSurfaceVariant }}>
                        {mode.desc}
                      </p>
                    </div>

                    <div className="w-1/2 flex justify-end">
                      <img
                        src={mode.img}
                        alt={mode.title}
                        className="w-28 h-28 object-contain grayscale"
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </section>

        {/* Final CTA */}
        <section
          className='p-12 mb-16 flex flex-col items-center text-center border'
          style={{ backgroundColor: C.surfaceContainerHigh, borderColor: C.outlineVariant }}
        >
          <h2
            className='text-3xl md:text-4xl mb-6'
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Ready to Elevate Your Career?
          </h2>
          <p className='max-w-xl mb-10 text-base' style={{ color: C.onSurfaceVariant }}>
            Practice with role-specific AI interviews and get instant, actionable feedback.
          </p>
          <button
            onClick={() => requireAuth("/interview")}
            className='px-12 py-4 text-sm font-semibold tracking-wide'
            style={{ backgroundColor: C.primary, color: C.onPrimary }}
          >
            Get Started Now
          </button>
        </section>

      </main>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

      <Footer />
    </div>
  )
}

export default Home