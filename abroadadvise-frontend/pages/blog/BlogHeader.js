"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, Calendar, Share2 } from "lucide-react"
import { API_BASE_URL } from "@/utils/api"

const BlogHeader = ({ blog }) => {
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
          title: blog.title,
          text: `Check out this blog: ${blog.title}`,
          url: shareUrl,
        })
      } catch (error) {
        console.error("Error sharing blog:", error)
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  if (!blog) return null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8">

      {/* Back to Blog Link */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-[#4c9bd5] hover:text-[#3a7aa8] transition-colors duration-200 group"
        >
          <ChevronLeft className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="font-medium">Back to Blogs</span>
        </Link>
      </div>

      {/* Ad Above Blog Title */}
      {aboveHeadlineAd && (
        <div className="w-full mb-8 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <a href={aboveHeadlineAd.redirect_url} target="_blank" rel="noopener noreferrer" className="block">
            <Image
              src={aboveHeadlineAd.desktop_image_url}
              alt={aboveHeadlineAd.title}
              width={1200}
              height={150}
              className="hidden sm:block w-full object-cover"
            />
            <Image
              src={aboveHeadlineAd.mobile_image_url || aboveHeadlineAd.desktop_image_url}
              alt={aboveHeadlineAd.title}
              width={600}
              height={100}
              className="block sm:hidden w-full object-cover"
            />
          </a>
        </div>
      )}

      <div className="space-y-6">
        {/* Blog Category */}
        {blog.category?.name && (
          <div>
            <Link
              href={`/blog/category/${blog.category.slug || blog.category.name.toLowerCase()}`}
              className="inline-block bg-[#4c9bd5]/10 text-[#4c9bd5] text-sm font-medium px-4 py-1.5 rounded-full hover:bg-[#4c9bd5]/20 transition-colors duration-200"
            >
              {blog.category.name}
            </Link>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">{blog.title}</h1>

        {/* Author, Date & Share */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <span className="text-sm font-medium text-gray-800">{blog.author_name}</span>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-[#4c9bd5]" />
            <span className="text-sm">
              {new Date(blog.published_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center text-sm font-medium text-[#4c9bd5] hover:text-[#3a7aa8] transition"
          >
            <Share2 className="w-4 h-4 mr-1" />
            {isCopied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      {/* Ad Below Blog Title */}
      {belowHeadlineAd && (
        <div className="w-full my-8 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <a href={belowHeadlineAd.redirect_url} target="_blank" rel="noopener noreferrer" className="block">
            <Image
              src={belowHeadlineAd.desktop_image_url}
              alt={belowHeadlineAd.title}
              width={1200}
              height={150}
              className="hidden sm:block w-full object-cover"
            />
            <Image
              src={belowHeadlineAd.mobile_image_url || belowHeadlineAd.desktop_image_url}
              alt={belowHeadlineAd.title}
              width={600}
              height={100}
              className="block sm:hidden w-full object-cover"
            />
          </a>
        </div>
      )}

      {/* Featured Image */}
      <div className="mt-8 mb-4">
        {blog.featured_image_url ? (
          <div className="rounded-xl overflow-hidden shadow-md">
            <Image
              src={blog.featured_image_url}
              alt={blog.title}
              width={1100}
              height={550}
              className="w-full object-cover"
              priority
            />
          </div>
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#4c9bd5]/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#4c9bd5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-gray-500 font-medium">No Image Available</span>
            </div>
          </div>
        )}
      </div>

      {/* Ad Below Image */}
      {belowImageAd && (
        <div className="w-full mt-8 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <a href={belowImageAd.redirect_url} target="_blank" rel="noopener noreferrer" className="block">
            <Image
              src={belowImageAd.desktop_image_url}
              alt={belowImageAd.title}
              width={1200}
              height={150}
              className="hidden sm:block w-full object-cover"
            />
            <Image
              src={belowImageAd.mobile_image_url || belowImageAd.desktop_image_url}
              alt={belowImageAd.title}
              width={600}
              height={100}
              className="block sm:hidden w-full object-cover"
            />
          </a>
        </div>
      )}
    </div>
  )
}

export default BlogHeader
