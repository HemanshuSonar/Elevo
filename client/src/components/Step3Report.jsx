import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

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

function Step3Report({ report }) {
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.bg }}>
        <p className="text-lg" style={{ fontFamily: "'Libre Caslon Text', serif", color: C.primary }}>Loading Report...</p>
      </div>
    );
  }
  const navigate = useNavigate()
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }))

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;


  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    // ================= TITLE =================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(6, 21, 14);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;

    // underline
    doc.setDrawColor(6, 21, 14);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;

    // ================= FINAL SCORE BOX =================
    doc.setFillColor(239, 237, 237);
    doc.rect(margin, currentY, contentWidth, 20, "F");

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Final Score: ${finalScore}/10`,
      pageWidth / 2,
      currentY + 12,
      { align: "center" }
    );

    currentY += 30;

    // ================= SKILLS BOX =================
    doc.setFillColor(245, 243, 243);
    doc.rect(margin, currentY, contentWidth, 30, "F");

    doc.setFontSize(12);

    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    currentY += 45;

    // ================= ADVICE =================
    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(195, 200, 195);
    doc.rect(margin, currentY, contentWidth, 35);

    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;

    // ================= QUESTION TABLE =================
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
      },
      headStyles: {
        fillColor: [6, 21, 14],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" }, // index
        1: { cellWidth: 55 }, // question
        2: { cellWidth: 20, halign: "center" }, // score
        3: { cellWidth: "auto" }, // feedback
      },
      alternateRowStyles: {
        fillColor: [245, 243, 243],
      },
    });


    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div className='min-h-screen px-4 sm:px-6 lg:px-10 py-8' style={{ backgroundColor: C.bg }}>
      <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='md:mb-10 w-full flex items-start gap-4 flex-wrap'>
          <button
            onClick={() => navigate("/history")}
            className='mt-1 p-3 border transition-colors'
            style={{ borderColor: C.outlineVariant }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.surfaceContainer}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          ><FaArrowLeft style={{ color: C.primary }} /></button>

          <div>
            <h1 className='text-3xl flex-nowrap' style={{ fontFamily: "'Libre Caslon Text', serif" }}>
              Interview Analytics Dashboard
            </h1>
            <p className='mt-2' style={{ color: C.onSurfaceVariant }}>
              AI-powered performance insights
            </p>

          </div>
        </div>

        <button
          onClick={downloadPDF}
          className='px-6 py-3 transition-all duration-300 font-semibold text-sm sm:text-base text-nowrap hover:opacity-90'
          style={{ backgroundColor: C.primary, color: C.onPrimary }}
        >Download PDF</button>
      </div>


      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>

        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border p-6 sm:p-8 text-center"
            style={{ borderColor: C.outlineVariant, backgroundColor: C.bg }}>

            <h3 className="mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: C.onSurfaceVariant }}>
              Overall Performance
            </h3>
            <div className='relative w-20 h-20 sm:w-25 sm:h-25 mx-auto'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: C.secondary,
                  textColor: C.primary,
                  trailColor: C.surfaceContainer,
                })}
              />
            </div>

            <p className="mt-3 text-xs sm:text-sm" style={{ color: C.onSurfaceVariant, opacity: 0.7 }}>
              Out of 10
            </p>

            <div className="mt-4">
              <p className="font-semibold text-sm sm:text-base" style={{ color: C.primary }}>
                {performanceText}
              </p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: C.onSurfaceVariant }}>
                {shortTagline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='border p-6 sm:p-8' style={{ borderColor: C.outlineVariant, backgroundColor: C.bg }}>
            <h3 className="text-base sm:text-lg mb-6" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
              Skill Evaluation
            </h3>

            <div className='space-y-5'>
              {
                skills.map((s, i) => (
                  <div key={i}>
                    <div className='flex justify-between mb-2 text-sm sm:text-base'>

                      <span style={{ color: C.primary }}>{s.label}</span>
                      <span className='font-semibold' style={{ color: C.secondary }}>{s.value}</span>
                    </div>

                    <div className='h-2 sm:h-3' style={{ backgroundColor: C.surfaceContainer }}>
                      <div className='h-full'
                        style={{ width: `${s.value * 10}%`, backgroundColor: C.primary }}

                      ></div>

                    </div>


                  </div>
                ))
              }
            </div>

          </motion.div>


        </div>

        <div className='lg:col-span-2 space-y-6'>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='border p-5 sm:p-8' style={{ borderColor: C.outlineVariant, backgroundColor: C.bg }}>
            <h3 className="text-base sm:text-lg mb-4 sm:mb-6" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
              Performance Trend
            </h3>

            <div className='h-64 sm:h-72'>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.outlineVariant} />
                  <XAxis dataKey="name" stroke={C.onSurfaceVariant} />
                  <YAxis domain={[0, 10]} stroke={C.onSurfaceVariant} />
                  <Tooltip />
                  <Area type="monotone"
                    dataKey="score"
                    stroke={C.primary}
                    fill={C.surfaceContainer}
                    strokeWidth={3} />


                </AreaChart>

              </ResponsiveContainer>


            </div>


          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='border p-5 sm:p-8' style={{ borderColor: C.outlineVariant, backgroundColor: C.bg }}>
            <h3 className="text-base sm:text-lg mb-6" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
              Question Breakdown
            </h3>
            <div className='space-y-6'>
              {questionWiseScore.map((q, i) => (
                <div key={i} className='p-4 sm:p-6 border' style={{ borderColor: C.outlineVariant, backgroundColor: C.surfaceContainerLow }}>

                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4'>
                    <div>
                      <p className="text-xs" style={{ color: C.onSurfaceVariant, opacity: 0.7 }}>
                        Question {i + 1}
                      </p>

                      <p className="font-semibold text-sm sm:text-base leading-relaxed" style={{ color: C.primary }}>
                        {q.question || "Question not available"}
                      </p>
                    </div>


                    <div className='px-3 py-1 font-bold text-xs sm:text-sm w-fit border' style={{ borderColor: C.outlineVariant, color: C.secondary }}>
                      {q.score ?? 0}/10
                    </div>
                  </div>

                  <div className='p-4 border' style={{ borderColor: C.outlineVariant, backgroundColor: C.bg }}>
                    <p className='text-xs font-semibold mb-1' style={{ color: C.secondary }}>
                      AI Feedback
                    </p>
                    <p className='text-sm leading-relaxed' style={{ color: C.onSurfaceVariant }}>

                      {q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No feedback available for this question."}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </motion.div>





        </div>
      </div>

    </div>
  )
}

export default Step3Report