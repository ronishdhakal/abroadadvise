import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const [siteLogo, setSiteLogo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ad, setAd] = useState(null);
  const [blogNewsAd, setBlogNewsAd] = useState(null);

  // ✅ Fetch the site logo
  useEffect(() => {
    const fetchSiteLogo = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/site-settings/");
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

  // ✅ Fetch the general navbar ad (Exclusive Below Navbar)
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ads/?placement=exclusive_below_navbar");
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

  // ✅ Fetch blog/news-specific ad (Below Navbar Blog News)
  useEffect(() => {
    const fetchBlogNewsAd = async () => {
      if (!router.isReady) return;

      if (router.pathname.startsWith("/blog") || router.pathname.startsWith("/news")) {
        try {
          const res = await fetch("http://127.0.0.1:8000/api/ads/?placement=below_navbar_blog_news");
          const data = await res.json();

          if (data.results.length > 0) {
            setBlogNewsAd(data.results[0]);
          }
        } catch (error) {
          console.error("Error fetching blog/news ad:", error);
        }
      }
    };

    fetchBlogNewsAd();
  }, [router.isReady, router.pathname]);

  return (
    <>
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50 w-full">
        {/* Logo */}
        <div className="flex items-center">
          {siteLogo ? (
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={siteLogo}
                alt="Abroad Advise Logo"
                width={128}
                height={64}
                className="object-contain"
              />
            </Link>
          ) : (
            <span className="text-black">Loading Logo...</span>
          )}
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-gray-800 font-medium">
          <Link href="/home" className="hover:text-blue-600">Home</Link>
          <Link href="/university" className="hover:text-blue-600">Universities</Link>
          <Link href="/course" className="hover:text-blue-600">Courses</Link>
          <Link href="/consultancy" className="hover:text-blue-600">Consultancies</Link>
          <Link href="/destination" className="hover:text-blue-600">Destinations</Link>
          <Link href="/event" className="hover:text-blue-600">Events</Link>
          <Link href="/news" className="hover:text-blue-600">News</Link>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </header>

      {/* ✅ Blog/News Ad Below Navbar (With Left & Right Margin) */}
      {blogNewsAd && (
        <div className="w-full flex justify-center py-4 bg-white">
          <div className="max-w-6xl w-full px-4"> {/* Adds left & right margin */}
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

      {/* ✅ Normal Ad Below Navbar (With Left & Right Margin) */}
      {ad && (
        <div className="w-full flex justify-center py-4 bg-white">
          <div className="max-w-6xl w-full px-4"> {/* Adds left & right margin */}
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
