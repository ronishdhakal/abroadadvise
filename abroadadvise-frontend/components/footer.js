import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import { API_BASE_URL } from "@/utils/api";

export default function Footer() {
  const router = useRouter();
  const [siteLogo, setSiteLogo] = useState(null);
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

  // Fetch General Above-Footer Ad
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ads/?placement=exclusive_above_footer`);
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

  // Fetch Blog/News-Specific Above-Footer Ad
  useEffect(() => {
    if (!router.isReady) return;
    if (router.pathname.startsWith("/blog") || router.pathname.startsWith("/news")) {
      const fetchBlogNewsAd = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/ads/?placement=above_footer_blog_news`);
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

  return (
    <>
      {/* General Ad Above Footer */}
      {ad && (
        <div className="w-full py-6 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <a href={ad.redirect_url} target="_blank" rel="noopener noreferrer">
              <Image
                src={isMobile ? ad.mobile_image_url : ad.desktop_image_url}
                alt={ad.title}
                width={isMobile ? 600 : 1200}
                height={isMobile ? 100 : 150}
                className="w-full object-cover rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              />
            </a>
          </div>
        </div>
      )}

      {/* Blog/News Ad Above Footer */}
      {blogNewsAd && (router.pathname.startsWith("/blog") || router.pathname.startsWith("/news")) && (
        <div className="w-full py-6 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <a href={blogNewsAd.redirect_url} target="_blank" rel="noopener noreferrer">
              <Image
                src={isMobile ? blogNewsAd.mobile_image_url : blogNewsAd.desktop_image_url}
                alt={blogNewsAd.title}
                width={isMobile ? 600 : 1200}
                height={isMobile ? 100 : 150}
                className="w-full object-cover rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              />
            </a>
          </div>
        </div>
      )}

      {/* Footer Main Section */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-left">
            {/* Logo & Info */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center">
                <Image
                  src={siteLogo || "/logo/default-logo.png"} // ✅ fallback to public static logo
                  alt="Abroad Advise Logo"
                  width={160}
                  height={50}
                  className="object-contain w-40 sm:w-48 transition-all duration-200 hover:opacity-90"
                  priority
                />
              </Link>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed tracking-wide">
                Abroad Advise Pvt. Ltd.<br />
                Kathmandu, Nepal<br />
                Reg No: 4247-2080/2081
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-[#4c9bd5] font-light text-lg tracking-wider mb-4">Abroad Advise</h2>
              <ul className="text-gray-600 text-sm space-y-3 font-light tracking-wide">
                <li><Link href="/course" className="hover:text-[#4c9bd5] transition-colors duration-200">Courses</Link></li>
                <li><Link href="/consultancy" className="hover:text-[#4c9bd5] transition-colors duration-200">Consultancies</Link></li>
                <li><Link href="/university" className="hover:text-[#4c9bd5] transition-colors duration-200">Universities</Link></li>
                <li><Link href="/event" className="hover:text-[#4c9bd5] transition-colors duration-200">Events</Link></li>
                <li><Link href="/about" className="hover:text-[#4c9bd5] transition-colors duration-200">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-[#4c9bd5] transition-colors duration-200">Contact Us</Link></li>
              </ul>
            </div>

            {/* Consultancy Links */}
            <div>
              <h2 className="text-[#4c9bd5] font-light text-lg tracking-wider mb-4">For Consultancy</h2>
              <ul className="text-gray-600 text-sm space-y-3 font-light tracking-wide">
                <li><Link href="/consultancy" className="hover:text-[#4c9bd5] transition-colors duration-200">Consultancies</Link></li>
                <li><Link href="/dashboard/consultancy/login" className="hover:text-[#4c9bd5] transition-colors duration-200">Login</Link></li>
                <li><Link href="/learn-more" className="hover:text-[#4c9bd5] transition-colors duration-200">Learn More</Link></li>
              </ul>
            </div>

            {/* Info & Legal Links */}
            <div>
              <h2 className="text-[#4c9bd5] font-light text-lg tracking-wider mb-4">More</h2>
              <ul className="text-gray-600 text-sm space-y-3 font-light tracking-wide">
                <li><Link href="/featured" className="hover:text-[#4c9bd5] transition-colors duration-200">Featured </Link></li>
                <li><Link href="/blog" className="hover:text-[#4c9bd5] transition-colors duration-200">Blogs</Link></li>
                <li><Link href="/news" className="hover:text-[#4c9bd5] transition-colors duration-200">News</Link></li>
                <li><Link href="/faqs" className="hover:text-[#4c9bd5] transition-colors duration-200">FAQs</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-[#4c9bd5] transition-colors duration-200">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#4c9bd5] transition-colors duration-200">Terms of Use</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-sm tracking-wide">
            <p>© {new Date().getFullYear()} Abroad Advise. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="https://www.facebook.com/abroadadvisefb/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#4c9bd5] transition-colors duration-200 text-lg">
                <FaFacebookF />
              </a>
              <a href="https://x.com/collegenepal?lang=en" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#4c9bd5] transition-colors duration-200 text-lg">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/collegeinfonp/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#4c9bd5] transition-colors duration-200 text-lg">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/company/abroadadvise" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#4c9bd5] transition-colors duration-200 text-lg">
                <FaLinkedin />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#4c9bd5] transition-colors duration-200 text-lg">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
