"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowLeft, Share2 } from "lucide-react"
import { API_BASE_URL } from "@/utils/api"

const NewsHeader = ({ news }) => {
  const [aboveHeadlineAd, setAboveHeadlineAd] = useState(null)
  const [belowHeadlineAd, setBelowHeadlineAd] = useState(null)
  const [belowImageAd, setBelowImageAd] = useState(null)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const fetchAd = async (placement, setAd) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ads/?placement=${placement}`)
        const data = await res.json()
        if (data.results.length > 0) {
          setAd(data.results[0])
        }
      } catch (error) {
        console.error(`Error fetching ${placement} ad:`, error)
      }
    }

    fetchAd("above_headline_blog_news", setAboveHeadlineAd)
    fetchAd("below_headline_blog_news", setBelowHeadlineAd)
    fetchAd("below_featured_image_blog_news", setBelowImageAd)
  }, [])

  const handleShare = async () => {
    const shareUrl = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: `Check out this news: ${news.title}`,
          url: shareUrl,
        })
      } catch (error) {
        console.error("Error sharing news:", error)
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  if (!news) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8">
      {/* Back to News Link */}
      <div className="mb-4">
        <Link href="/news" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Link>
      </div>

      {/* Ad Above News Title */}
      {aboveHeadlineAd && (
        <div className="w-full mb-4 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <a href={aboveHeadlineAd.redirect_url} target="_blank" rel="noopener noreferrer">
            {/* Desktop */}
            <Image
              src={aboveHeadlineAd.desktop_image_url}
              alt={aboveHeadlineAd.title}
              width={1200}
              height={150}
              className="hidden sm:block object-cover w-full"
            />
            {/* Mobile */}
            <Image
              src={aboveHeadlineAd.mobile_image_url || aboveHeadlineAd.desktop_image_url}
              alt={aboveHeadlineAd.title}
              width={600}
              height={100}
              className="block sm:hidden object-cover w-full"
            />
          </a>
        </div>
      )}

      {/* News Category */}
      {news.category?.name && (
        <div className="mb-2">
          <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
            {news.category.name}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold text-black leading-tight">{news.title}</h1>

      {/* Ad Below Title */}
      {belowHeadlineAd && (
        <div className="w-full mt-4 mb-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <a href={belowHeadlineAd.redirect_url} target="_blank" rel="noopener noreferrer">
            {/* Desktop */}
            <Image
              src={belowHeadlineAd.desktop_image_url}
              alt={belowHeadlineAd.title}
              width={1200}
              height={150}
              className="hidden sm:block object-cover w-full"
            />
            {/* Mobile */}
            <Image
              src={belowHeadlineAd.mobile_image_url || belowHeadlineAd.desktop_image_url}
              alt={belowHeadlineAd.title}
              width={600}
              height={100}
              className="block sm:hidden object-cover w-full"
            />
          </a>
        </div>
      )}

      {/* Date + Share Button */}
      <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-2">
        <p className="text-sm">{news.date?.split("T")[0]}</p>
        <button
          onClick={handleShare}
          className="flex items-center text-sm font-medium text-[#4c9bd5] hover:text-[#3a7aa8] transition"
        >
          <Share2 className="w-4 h-4 mr-1" />
          {isCopied ? "Copied!" : "Share"}
        </button>
      </div>

      {/* Featured Image */}
      <div className="mt-4">
        {news.featured_image_url ? (
          <Image
            src={news.featured_image_url}
            alt={news.title}
            width={1100}
            height={550}
            className="w-full rounded-lg object-cover"
            priority
          />
        ) : (
          <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg">
            <span className="text-gray-400 text-sm">No Image Available</span>
          </div>
        )}
      </div>

      {/* Ad Below Image */}
      {belowImageAd && (
        <div className="w-full mt-4 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <a href={belowImageAd.redirect_url} target="_blank" rel="noopener noreferrer">
            {/* Desktop */}
            <Image
              src={belowImageAd.desktop_image_url}
              alt={belowImageAd.title}
              width={1200}
              height={150}
              className="hidden sm:block object-cover w-full"
            />
            {/* Mobile */}
            <Image
              src={belowImageAd.mobile_image_url || belowImageAd.desktop_image_url}
              alt={belowImageAd.title}
              width={600}
              height={100}
              className="block sm:hidden object-cover w-full"
            />
          </a>
        </div>
      )}
    </div>
  )
}

export default NewsHeader
