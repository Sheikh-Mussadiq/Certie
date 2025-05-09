"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"

export default function LandingPage() {
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 })

  const scrollToFeatures = () => {
    featuresRef.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="bg-gradient-to-b from-primary-50 to-white overflow-x-hidden">
      This is the landing page
    </div>
  )
}

