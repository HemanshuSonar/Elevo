import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react";
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
  surfaceContainerLow: "#f5f3f3",
  surfaceContainerHigh: "#eae8e7",
};

function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch()

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];



  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      const amount =
        plan.id === "basic" ? 100 :
          plan.id === "pro" ? 500 : 0;

      const result = await axios.post(ServerUrl + "/api/payment/order", {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      }, { withCredentials: true })


      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "Elevo",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          const verifypay = await axios.post(ServerUrl + "/api/payment/verify", response, { withCredentials: true })
          dispatch(setUserData(verifypay.data.user))

          alert("Payment Successful 🎉 Credits Added!");
          navigate("/")

        },
        theme: {
          color: C.primary,
        },

      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      setLoadingPlan(null);
    } catch (error) {
      console.log(error)
      setLoadingPlan(null);
    }
  }



  return (
    <div className='min-h-screen py-16 px-6' style={{ backgroundColor: C.bg }}>

      <div className='max-w-6xl mx-auto mb-16 flex items-start gap-4'>

        <button
          onClick={() => navigate("/")}
          className='mt-2 p-3 border transition-colors'
          style={{ borderColor: C.outlineVariant }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.surfaceContainer}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <FaArrowLeft style={{ color: C.primary }} />
        </button>

        <div className="text-center w-full">
          <h1
            className="text-3xl md:text-4xl"
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Choose Your Plan
          </h1>
          <p className="mt-3 text-base md:text-lg" style={{ color: C.onSurfaceVariant }}>
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>


      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>

        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id

          return (
            <motion.div key={plan.id}
              whileHover={!plan.default ? { y: -4 } : {}}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}

              className='relative p-8 transition-all duration-300 border'
              style={{
                borderColor: isSelected ? C.primary : C.outlineVariant,
                backgroundColor: C.bg,
                cursor: plan.default ? "default" : "pointer",
              }}
            >

              {/* Badge */}
              {plan.badge && (
                <div
                  className="absolute top-6 right-6 text-xs px-4 py-1 uppercase tracking-wider"
                  style={{ backgroundColor: C.primary, color: C.onPrimary }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div
                  className="absolute top-6 right-6 text-xs px-3 py-1 uppercase tracking-wider"
                  style={{ backgroundColor: C.surfaceContainer, color: C.onSurfaceVariant }}
                >
                  Default
                </div>
              )}

              {/* Plan Name */}
              <h3
                className="text-xl"
                style={{ fontFamily: "'Libre Caslon Text', serif" }}
              >
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4">
                <span className="text-3xl" style={{ fontFamily: "'Libre Caslon Text', serif", color: C.secondary }}>
                  {plan.price}
                </span>
                <p className="mt-1 text-sm" style={{ color: C.onSurfaceVariant }}>
                  {plan.credits} Credits
                </p>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed" style={{ color: C.onSurfaceVariant }}>
                {plan.description}
              </p>

              {/* Divider */}
              <div className="mt-6 pt-6 border-t space-y-3 text-left" style={{ borderColor: C.outlineVariant }}>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FaCheckCircle className="text-sm" style={{ color: C.secondary }} />
                    <span className="text-sm" style={{ color: C.primary }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!plan.default &&
                <button
                  disabled={loadingPlan === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      setSelectedPlan(plan.id)
                    } else {
                      handlePayment(plan)
                    }
                  }}
                  className='w-full mt-8 py-3 text-sm font-semibold tracking-wide transition-colors disabled:opacity-60'
                  style={
                    isSelected
                      ? { backgroundColor: C.primary, color: C.onPrimary }
                      : { backgroundColor: C.surfaceContainer, color: C.primary }
                  }
                >
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : isSelected
                      ? "Proceed to Pay"
                      : "Select Plan"}

                </button>
              }
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}

export default Pricing