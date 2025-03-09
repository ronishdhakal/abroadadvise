"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

export default function RoadblockAd() {
  const [showAd, setShowAd] = useState(false)
  const [ad, setAd] = useState(null)

  useEffect(() => {
    // Fetch the roadblock ad
    const fetchAd = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ads/?placement=roadblock_ad")
        const data = await res.json()

        if (data.results.length > 0) {
          setAd(data.results[0]) // Get the first ad if available
          setShowAd(true) // Show the ad
        }
      } catch (error) {
        console.error("Error fetching roadblock ad:", error)
      }
    }

    fetchAd()
  }, [])

  const closeAd = () => setShowAd(false)

  if (!showAd || !ad) return null

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4 md:p-6"
      style={{
        animation: "fadeIn 0.3s ease-out forwards",
      }}
    >
      <div className="relative mx-auto overflow-hidden rounded-xl shadow-2xl">
        {/* Container with exact dimensions */}
        <div className="w-[400px] h-[500px] md:w-[1180px] md:h-[715px]">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition-all duration-200 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            onClick={closeAd}
            aria-label="Close advertisement"
            style={{
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>

          {/* Clickable Ad */}
          <a
            href={ad.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full transition-transform duration-300 hover:scale-[1.01]"
          >
            {/* Desktop Image */}
            <div className="hidden md:block w-full h-full">
              <Image
                src={ad.desktop_image_url || "/placeholder.svg"}
                alt={ad.title}
                width={1180}
                height={715}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* Mobile Image */}
            <div className="md:hidden w-full h-full">
              <Image
                src={ad.mobile_image_url || "/placeholder.svg"}
                alt={ad.title}
                width={400}
                height={500}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

