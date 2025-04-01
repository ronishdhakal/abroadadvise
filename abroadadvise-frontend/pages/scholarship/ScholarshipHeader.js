"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, MapPin, GraduationCap, Share, Clock, ExternalLink, Check } from "lucide-react"
import { API_BASE_URL } from "@/utils/api"
import { cn } from "@/lib/utils"

const ScholarshipHeader = ({ scholarship }) => {
  const [aboveHeadlineAd, setAboveHeadlineAd] = useState(null)
  const [belowHeadlineAd, setBelowHeadlineAd] = useState(null)
  const [belowImageAd, setBelowImageAd] = useState(null)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const fetchAd = async (placement, setAd) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ads/?placement=${placement}`)
        const data = await res.json()
        if (data.results.length > 0) setAd(data.results[0])
      } catch (error) {
        console.error(`Error fetching ${placement} ad:`, error)
      }
    }

    fetchAd("above_headline_blog_news", setAboveHeadlineAd)
    fetchAd("below_headline_blog_news", setBelowHeadlineAd)
    fetchAd("below_featured_image_blog_news", setBelowImageAd)
  }, [])

  if (!scholarship) return null

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: scholarship.title,
          text: `Check out this scholarship: ${scholarship.title}`,
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      }
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Link
          href="/scholarship"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Scholarships
        </Link>
      </div>

      {aboveHeadlineAd && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <a href={aboveHeadlineAd.redirect_url} target="_blank" rel="noopener noreferrer" className="block">
            <Image
              src={aboveHeadlineAd.desktop_image_url || "/placeholder.svg"}
              alt={aboveHeadlineAd.title}
              width={1200}
              height={150}
              className="w-full object-cover"
            />
          </a>
        </div>
      )}

      <div className="space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">{scholarship.title}</h1>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span className="inline-flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Published: {formatDate(scholarship.published_date)}
          </span>

          {scholarship.by && (
            <>
              <span className="mx-2 text-gray-300">•</span>
              <span>By {scholarship.by}</span>
            </>
          )}
        </div>

        {belowHeadlineAd && (
          <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <a href={belowHeadlineAd.redirect_url} target="_blank" rel="noopener noreferrer" className="block">
              <Image
                src={belowHeadlineAd.desktop_image_url || "/placeholder.svg"}
                alt={belowHeadlineAd.title}
                width={1200}
                height={150}
                className="w-full object-cover"
              />
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-3">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Application Period</p>
              <p className="text-sm font-semibold">
                {formatDate(scholarship.active_from)} – {formatDate(scholarship.active_to)}
              </p>
            </div>
          </div>

          {scholarship.destination?.title && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-3">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Destination</p>
                <p className="text-sm font-semibold">{scholarship.destination.title}</p>
              </div>
            </div>
          )}

          {scholarship.study_level && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-3">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Study Level</p>
                <p className="text-sm font-semibold">
                  {scholarship.study_level.charAt(0).toUpperCase() + scholarship.study_level.slice(1)}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleShare}
          className={cn(
            "inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50",
            "text-gray-800 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary/20",
          )}
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              Copied to clipboard!
            </>
          ) : (
            <>
              <Share className="h-4 w-4" />
              Share Scholarship
            </>
          )}
        </button>

        <div className="mt-6 rounded-xl overflow-hidden shadow-md">
          {scholarship.featured_image ? (
            <Image
              src={scholarship.featured_image || "/placeholder.svg"}
              alt={scholarship.title}
              width={1100}
              height={550}
              className="w-full object-cover max-h-[500px]"
              priority
            />
          ) : (
            <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg">
              <span className="text-gray-400 text-sm">No Image Available</span>
            </div>
          )}
        </div>

        {belowImageAd && (
          <div className="mt-8 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <a href={belowImageAd.redirect_url} target="_blank" rel="noopener noreferrer" className="block group">
              <div className="relative">
                <Image
                  src={belowImageAd.desktop_image_url || "/placeholder.svg"}
                  alt={belowImageAd.title}
                  width={1200}
                  height={150}
                  className="w-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3 mr-1" /> Sponsored
                </div>
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScholarshipHeader

