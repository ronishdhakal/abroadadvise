import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";
import { API_BASE_URL } from "@/utils/api"; // ✅ Use dynamic base URL

export default function Header() {
  const router = useRouter();
  const [siteLogo, setSiteLogo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ad, setAd] = useState(null);
  const [blogNewsAd, setBlogNewsAd] = useState(null);

  // ✅ Fetch Site Logo
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

  // ✅ Fetch General Below-Navbar Ad
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

  // ✅ Fetch Blog/News-Specific Below-Navbar Ad
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
    }
  };

  return (
    <>
      {/* ✅ Navbar */}
      <header className="bg-white shadow-md px-8 md:px-12 py-3 flex justify-between items-center sticky top-0 z-50 w-full border-b border-gray-200 font-sans">
        <div className="flex items-center">
          {siteLogo ? (
            <Link href="/" className="flex items-center space-x-2">
              <Image src={siteLogo} alt="Abroad Advise Logo" width={180} height={80} className="object-contain" />
            </Link>
          ) : (
            <span className="text-black font-semibold">Loading Logo...</span>
          )}
        </div>

        {/* ✅ Navigation */}
        <nav className="hidden lg:flex space-x-8 text-gray-800 font-medium text-lg tracking-wide">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/university" className="hover:text-blue-600 transition">Universities</Link>
          <Link href="/course" className="hover:text-blue-600 transition">Courses</Link>
          <Link href="/consultancy" className="hover:text-blue-600 transition">Consultancies</Link>
          <Link href="/destination" className="hover:text-blue-600 transition">Destinations</Link>
          <Link href="/event" className="hover:text-blue-600 transition">Events</Link>
          <Link href="/news" className="hover:text-blue-600 transition">News</Link>
          <Link href="/blog" className="hover:text-blue-600 transition">Blog</Link>
        </nav>

        {/* ✅ Search & Menu */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition shadow-md">
            <FiSearch className="text-white w-6 h-6" />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2">
            {menuOpen ? <HiX className="w-6 h-6 text-gray-600" /> : <HiMenu className="w-6 h-6 text-gray-600" />}
          </button>
        </div>
      </header>

      {/* ✅ Search Bar */}
      {searchOpen && (
        <div className="sticky top-[60px] w-full bg-white shadow-md px-6 py-4 flex justify-center z-40 border-b border-gray-200">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl flex items-center space-x-3">
            <div className="relative w-full flex items-center bg-gray-100 rounded-full shadow-lg px-5 py-3">
              <FiSearch className="text-gray-500 w-6 h-6 absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search universities, courses, consultancies..."
                className="w-full bg-transparent pl-12 pr-4 py-2 focus:outline-none text-gray-900 text-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition shadow-md"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* ✅ Blog/News Ad */}
      {blogNewsAd && (
        <div className="w-full flex justify-center py-4 bg-white">
          <div className="max-w-6xl w-full px-4">
            <a href={blogNewsAd.redirect_url} target="_blank" rel="noopener noreferrer">
              <Image
                src={blogNewsAd.desktop_image_url}
                alt={blogNewsAd.title}
                width={1200}
                height={150}
                className="w-full object-cover rounded-lg"
              />
            </a>
          </div>
        </div>
      )}

      {/* ✅ General Ad */}
      {ad && (
        <div className="w-full flex justify-center py-4 bg-white">
          <div className="max-w-6xl w-full px-4">
            <a href={ad.redirect_url} target="_blank" rel="noopener noreferrer">
              <Image
                src={ad.desktop_image_url}
                alt={ad.title}
                width={1200}
                height={150}
                className="w-full object-cover rounded-lg"
              />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
