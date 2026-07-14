import React from 'react'
import { BsRobot } from 'react-icons/bs'

// Elevo design tokens (literal hex values so no tailwind.config changes are required)
const C = {
  bg: "#fbf9f8",
  primary: "#06150e",
  onPrimary: "#ffffff",
  secondary: "#755939",
  outlineVariant: "#c3c8c3",
  onSurfaceVariant: "#434844",
};

function Footer() {
  return (
    <footer className='w-full mt-10 border-t' style={{ backgroundColor: C.bg, borderColor: C.outlineVariant }}>

      {/* Brand strip */}
      <div className='max-w-6xl mx-auto px-6 py-14 text-center border-b' style={{ borderColor: C.outlineVariant }}>
        <div className='flex justify-center items-center gap-3 mb-4'>
          <div className='p-2' style={{ backgroundColor: C.primary, color: C.onPrimary }}>
            <BsRobot size={16} />
          </div>
          <h2 style={{ fontFamily: "'Libre Caslon Text', serif" }}>Elevo</h2>
        </div>
        <p className='text-sm max-w-xl mx-auto leading-relaxed' style={{ color: C.onSurfaceVariant }}>
          AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>
      </div>

    </footer>
  )
}

export default Footer