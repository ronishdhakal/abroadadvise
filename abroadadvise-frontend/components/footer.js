import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import { API_BASE_URL } from "@/utils/api"; // ✅ Use centralized API base URL

export default function Footer() {
  const router = useRouter();
  const [siteLogo, setSiteLogo] = useState(null);
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

  // ✅ Fetch General Above-Footer Ad
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

  // ✅ Fetch Blog/News-Specific Above-Footer Ad
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
      {/* ✅ Blog/News Ad Above Footer */}
      {blogNewsAd && (
        <div className="w-full flex justify-center py-6 bg-white">
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

      {/* ✅ General Ad Above Footer */}
      {ad && !router.pathname.startsWith("/blog") && !router.pathname.startsWith("/news") && (
        <div className="w-full flex justify-center py-6 bg-white">
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

      {/* ✅ Footer Main Section */}
      <footer className="bg-white py-10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-left">
            {/* Logo & Info */}
            <div className="md:col-span-2">
              {siteLogo && (
                <Image src={siteLogo} alt="Abroad Advise Logo" width={160} height={80} className="mb-3" />
              )}
              <p className="text-gray-600 text-sm">
                Abroad Advise Pvt. Ltd., <br />
                Kathmandu, Nepal <br />
                Reg No: 4247-2080/2081
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-blue-500 font-semibold mb-3">Abroad Advise</h2>
              <ul className="text-gray-600 text-sm space-y-2">
                <li><Link href="/course" className="hover:text-blue-600">Course</Link></li>
                <li><Link href="/consultancy" className="hover:text-blue-600">Consultancy</Link></li>
                <li><Link href="/university" className="hover:text-blue-600">University</Link></li>
                <li><Link href="/event" className="hover:text-blue-600">Events</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600">Contact Us</Link></li>
              </ul>
            </div>

            {/* Info Links */}
            <div>
              <h2 className="text-blue-500 font-semibold mb-3">Information</h2>
              <ul className="text-gray-600 text-sm space-y-2">
                <li><Link href="/blog" className="hover:text-blue-600">Blogs</Link></li>
                <li><Link href="/news" className="hover:text-blue-600">News</Link></li>
                <li><Link href="/about" className="hover:text-blue-600">About Us</Link></li>
                <li><Link href="/faqs" className="hover:text-blue-600">FAQs</Link></li>
              </ul>
            </div>

            {/* Legal Info */}
            <div>
              <h2 className="text-blue-500 font-semibold mb-3">Legal Information</h2>
              <ul className="text-gray-600 text-sm space-y-2">
                <li><Link href="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600">Terms of Use</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
            <p>&copy; 2025 Abroad Advise. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="https://www.facebook.com/abroadadvisefb/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 text-lg"><FaFacebookF /></a>
              <a href="https://x.com/collegenepal?lang=en" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 text-lg"><FaTwitter /></a>
              <a href="https://www.instagram.com/collegeinfonp/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 text-lg"><FaInstagram /></a>
              <a href="https://www.linkedin.com/company/abroadadvise" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 text-lg"><FaLinkedin /></a>
              <a href="#" className="hover:text-blue-600 text-lg"><FaYoutube /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
