"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";
import Head from "next/head"; // ✅ Added to handle favicon

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ad, setAd] = useState(null);
  const [blogNewsAd, setBlogNewsAd] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch general ad
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads/?placement=exclusive_below_navbar`);
        const data = await res.json();
        if (data.results.length > 0) setAd(data.results[0]);
      } catch (error) {
        console.error("Error fetching ad:", error);
      }
    };
    fetchAd();
  }, []);

  // Fetch blog/news-specific ad
  useEffect(() => {
    if (!router.isReady) return;
    if (router.pathname.startsWith("/blog") || router.pathname.startsWith("/news")) {
      const fetchBlogNewsAd = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads/?placement=below_navbar_blog_news`);
          const data = await res.json();
          if (data.results.length > 0) setBlogNewsAd(data.results[0]);
        } catch (error) {
          console.error("Error fetching blog/news ad:", error);
        }
      };
      fetchBlogNewsAd();
    }
  }, [router.isReady, router.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  return (
    <>
      {/* ✅ Add favicon */}
      <Head>
        <link rel="icon" href="/logo/Icon.png" />
      </Head>

      {/* Navbar */}
      <header className="bg-white px-4 sm:px-6 md:px-10 py-4 flex justify-between items-center sticky top-0 z-50 w-full border-b border-gray-100 transition-all duration-300">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/default-logo.png"
              alt="Abroad Advise Logo"
              width={140}
              height={50}
              priority
              className="object-contain w-36 sm:w-44"
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center space-x-8 text-gray-700 font-medium text-base tracking-wide">
          {[
            ["Home", "/"],
            ["Universities", "/university"],
            ["Colleges", "/college"],
            ["Courses", "/course"],
            ["Consultancies", "/consultancy"],
            ["Destinations", "/destination"],
            ["Scholarships", "/scholarship"],
            ["Exams", "/exam"],
            ["Events", "/event"],
            ["News", "/news"],
            ["Blog", "/blog"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="hover:text-[#4c9bd5] transition-colors duration-200 relative group"
            >
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-gray-600 hover:text-[#4c9bd5] transition-colors duration-200 p-2"
          >
            <FiSearch className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-600 hover:text-[#4c9bd5] transition-colors duration-200 p-2"
          >
            {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden fixed top-[72px] left-0 w-full bg-white z-40 border-b border-gray-100 shadow-sm animate-slide-down">
          <nav className="flex flex-col px-4 py-6 space-y-4 text-gray-700 font-medium text-base">
            {[
              ["Home", "/"],
              ["Universities", "/university"],
              ["College", "/college"],
              ["Courses", "/course"],
              ["Consultancies", "/consultancy"],
              ["Destinations", "/destination"],
              ["Scholarships", "/scholarship"],
              ["Exams", "/exam"],
              ["Events", "/event"],
              ["News", "/news"],
              ["Blog", "/blog"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="hover:text-[#4c9bd5] transition-colors duration-200 py-2"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Search Bar */}
      {searchOpen && (
        <div className="sticky top-[72px] w-full bg-white z-40 border-b border-gray-100 px-4 sm:px-6 py-4 shadow-sm transition-all duration-300">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center space-x-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4c9bd5] w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search universities, courses..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] text-gray-700 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-[#4c9bd5] text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-[#3a8cc1] transition"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Blog/News Ad */}
      {blogNewsAd && (
        <div className="w-full py-4 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <a href={blogNewsAd.redirect_url} target="_blank" rel="noopener noreferrer">
              <Image
                src={isMobile ? blogNewsAd.mobile_image_url : blogNewsAd.desktop_image_url}
                alt={blogNewsAd.title}
                width={isMobile ? 600 : 1200}
                height={isMobile ? 100 : 150}
                className="w-full object-cover rounded-lg shadow-sm"
              />
            </a>
          </div>
        </div>
      )}

      {/* General Ad */}
      {ad && (
        <div className="w-full py-4 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <a href={ad.redirect_url} target="_blank" rel="noopener noreferrer">
              <Image
                src={isMobile ? ad.mobile_image_url : ad.desktop_image_url}
                alt={ad.title}
                width={isMobile ? 600 : 1200}
                height={isMobile ? 100 : 150}
                className="w-full object-cover rounded-lg shadow-sm"
              />
            </a>
          </div>
        </div>
      )}
    </>
  );
}

// Optional CSS (tailwind global)
const styles = `
  @keyframes slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }
`;