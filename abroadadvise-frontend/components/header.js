"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";
import { API_BASE_URL } from "@/utils/api";

export default function Header() {
  const router = useRouter();
  const [siteLogo, setSiteLogo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ad, setAd] = useState(null);
  const [blogNewsAd, setBlogNewsAd] = useState(null);

  // Fetch Site Logo
  useEffect(() => {
    const fetchSiteLogo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/site-settings/`);
        const data = await res.json();
        if (data.site_logo_url) {
          setSiteLogo(data.site_logo_url);
        }
      } catch (error) {
        console.error("Error fetching site logo:", error);
      }
    };
    fetchSiteLogo();
  }, []);

  // Fetch General Below-Navbar Ad
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ads/?placement=exclusive_below_navbar`);
        const data = await res.json();
        if (data.results.length > 0) {
          setAd(data.results[0]);
        }
      } catch (error) {
        console.error("Error fetching ad:", error);
      }
    };
    fetchAd();
  }, []);

  // Fetch Blog/News-Specific Below-Navbar Ad
  useEffect(() => {
    if (!router.isReady) return;
    if (router.pathname.startsWith("/blog") || router.pathname.startsWith("/news")) {
      const fetchBlogNewsAd = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/ads/?placement=below_navbar_blog_news`);
          const data = await res.json();
          if (data.results.length > 0) {
            setBlogNewsAd(data.results[0]);
          }
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
      {/* Navbar */}
      <header className="bg-white px-4 sm:px-6 md:px-10 py-4 flex justify-between items-center sticky top-0 z-50 w-full border-b border-gray-100 transition-all duration-300">
        <div className="flex items-center">
          {siteLogo ? (
            <Link href="/" className="flex items-center">
              <Image src={siteLogo} alt="Abroad Advise Logo" width={140} height={50} className="object-contain w-36 sm:w-44" />
            </Link>
          ) : (
            <span className="text-gray-700 font-medium text-sm sm:text-base">Loading...</span>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 text-gray-700 font-medium text-base tracking-wide">
          <Link href="/" className="hover:text-[#4c9bd5] transition-colors duration-200 relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/university" className="hover:text-[#4c9bd5] transition-colors duration-200 relative group">
            Universities
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/college" className="hover:text-[#4c9bd5] transition-colors duration-200 relative group">
            Colleges
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/course" className="hover:text-[#4c9bd5] transition-colors duration-200 relative group">
            Courses
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/consultancy" className="hover:text-[#4c9bd5] transition-colors duration-200 relative group">
            Consultancies
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/destination" className="hover:text-[#4c9bd5] transition-colors duration-200 relative group">
            Destinations
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/scholarship" className="hover:text-[#4c9bd5] transition-colors duration-200 relative group">
            Scholarships
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/exam" className="hover:text-[#4c9bd5] transition-colors duration-200 relative group">
            Exams
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/event" className="hover:text-[#4c9bd5] transition-colors duration-200 relative group">
            Events
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/news" className="hover:text-[#4c9bd5] transition-colors duration-200 relative group">
            News
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/blog" className="hover:text-[#4c9bd5] transition-colors duration-200 relative group">
            Blog
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4c9bd5] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Search & Menu Buttons */}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed top-[72px] left-0 w-full bg-white z-40 border-b border-gray-100 shadow-sm animate-slide-down">
          <nav className="flex flex-col px-4 py-6 space-y-4 text-gray-700 font-medium text-base">
            <Link href="/" className="hover:text-[#4c9bd5] transition-colors duration-200 py-2" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/university" className="hover:text-[#4c9bd5] transition-colors duration-200 py-2" onClick={() => setMenuOpen(false)}>
              Universities
            </Link>
            <Link href="/college" className="hover:text-[#4c9bd5] transition-colors duration-200 py-2" onClick={() => setMenuOpen(false)}>
              College
            </Link>
    
            <Link href="/course" className="hover:text-[#4c9bd5] transition-colors duration-200 py-2" onClick={() => setMenuOpen(false)}>
              Courses
            </Link>
            <Link href="/consultancy" className="hover:text-[#4c9bd5] transition-colors duration-200 py-2" onClick={() => setMenuOpen(false)}>
              Consultancies
            </Link>
            <Link href="/destination" className="hover:text-[#4c9bd5] transition-colors duration-200 py-2" onClick={() => setMenuOpen(false)}>
              Destinations
            </Link>
            <Link href="/scholarship" className="hover:text-[#4c9bd5] transition-colors duration-200 py-2" onClick={() => setMenuOpen(false)}>
              Scholarships
            </Link>
            <Link href="/exam" className="hover:text-[#4c9bd5] transition-colors duration-200 py-2" onClick={() => setMenuOpen(false)}>
              Exams
            </Link>
            <Link href="/event" className="hover:text-[#4c9bd5] transition-colors duration-200 py-2" onClick={() => setMenuOpen(false)}>
              Events
            </Link>
            <Link href="/news" className="hover:text-[#4c9bd5] transition-colors duration-200 py-2" onClick={() => setMenuOpen(false)}>
              News
            </Link>
            <Link href="/blog" className="hover:text-[#4c9bd5] transition-colors duration-200 py-2" onClick={() => setMenuOpen(false)}>
              Blog
            </Link>
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
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] focus:border-transparent text-gray-700 text-sm sm:text-base transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="bg-[#4c9bd5] text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-[#4c9bd5]/90 transition-colors duration-200 text-sm sm:text-base font-medium"
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
                src={blogNewsAd.desktop_image_url}
                alt={blogNewsAd.title}
                width={1200}
                height={150}
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
                src={ad.desktop_image_url}
                alt={ad.title}
                width={1200}
                height={150}
                className="w-full object-cover rounded-lg shadow-sm"
              />
            </a>
          </div>
        </div>
      )}
    </>
  );
}

// Add this to your CSS (e.g., in a global CSS file or Tailwind config)
const styles = `
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }
`;