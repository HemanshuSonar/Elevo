import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App';
import Step3Report from '../components/Step3Report';

function InterviewReport() {
  const { id } = useParams()
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/interview/report/" + id, { withCredentials: true })

        console.log(result.data)
        setReport(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchReport()
  }, [])


  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fbf9f8" }}>
        <div className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "#755939" }}
          ></span>
          <p className="text-lg" style={{ fontFamily: "'Libre Caslon Text', serif", color: "#06150e" }}>
            Loading Report...
          </p>
        </div>
      </div>
    );
  }

  return <Step3Report report={report} />
}

export default InterviewReport