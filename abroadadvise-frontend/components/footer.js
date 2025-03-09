import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Image from "next/image"; // Next.js Image component

export default function Footer() {
  const router = useRouter();
  const [ad, setAd] = useState(null);
  const [blogNewsAd, setBlogNewsAd] = useState(null);

  // ✅ Fetch the general ad for above-footer placement
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ads/?placement=exclusive_above_footer");
        const data = await res.json();

        if (data.results.length > 0) {
          setAd(data.results[0]); // Get the first ad if available
        }
      } catch (error) {
        console.error("Error fetching above-footer ad:", error);
      }
    };

    fetchAd();
  }, []);

  // ✅ Fetch the ad for blog/news pages (Above Footer Blog News)
  useEffect(() => {
    if (!router.isReady) return; // ✅ Ensure the route is ready before making requests

    if (router.pathname.startsWith("/blog") || router.pathname.startsWith("/news")) {
      const fetchBlogNewsAd = async () => {
        try {
          console.log("Fetching Blog/News Above Footer Ad..."); // Debugging log
          const res = await fetch("http://127.0.0.1:8000/api/ads/?placement=above_footer_blog_news");
          const data = await res.json();

          if (data.results.length > 0) {
            console.log("Fetched Blog/News Ad:", data.results[0]); // Debugging log
            setBlogNewsAd(data.results[0]);
          } else {
            console.log("No Blog/News ad found."); // Debugging log
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
      {/* ✅ Blog/News Ad Above Footer (Only on Blog/News Pages) */}
      {blogNewsAd && (
        <div className="w-full flex justify-center py-6 bg-white">
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

      {/* ✅ Normal Ad Above Footer (For all pages except Blog/News) */}
      {ad && !router.pathname.startsWith("/blog") && !router.pathname.startsWith("/news") && (
        <div className="w-full flex justify-center py-6 bg-white">
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

      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* About Section */}
            <div>
              <h2 className="text-lg font-semibold">About Abroad Advise</h2>
              <p className="text-gray-400 mt-2 text-sm">
                Helping students navigate study abroad opportunities with trusted information on universities, courses, consultancies, and exams.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-lg font-semibold">Quick Links</h2>
              <ul className="mt-2 space-y-2 text-sm">
                <li><Link href="/consultancy" className="hover:text-blue-400">Find a Consultancy</Link></li>
                <li><Link href="/university" className="hover:text-blue-400">Explore Universities</Link></li>
                <li><Link href="/course" className="hover:text-blue-400">Courses</Link></li>
                <li><Link href="/event" className="hover:text-blue-400">Upcoming Events</Link></li>
                <li><Link href="/blog" className="hover:text-blue-400">Study Abroad Blog</Link></li>
              </ul>
            </div>

            {/* Contact & Socials */}
            <div>
              <h2 className="text-lg font-semibold">Contact Us</h2>
              <p className="text-gray-400 mt-2 text-sm">info@abroadadvise.com</p>
              <p className="text-gray-400 text-sm">+977-123456789</p>
              
              {/* Social Icons */}
              <div className="flex justify-center md:justify-start space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-blue-500 text-lg"><FaFacebookF /></a>
                <a href="#" className="text-gray-400 hover:text-blue-500 text-lg"><FaTwitter /></a>
                <a href="#" className="text-gray-400 hover:text-blue-500 text-lg"><FaInstagram /></a>
                <a href="#" className="text-gray-400 hover:text-blue-500 text-lg"><FaLinkedin /></a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
            <p>&copy; 2025 Abroad Advise. All Rights Reserved.</p>
            <p className="mt-2">
              <Link href="/privacy-policy" className="hover:text-gray-300 mx-2">Privacy Policy</Link> | 
              <Link href="/terms" className="hover:text-gray-300 mx-2">Terms of Service</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
