import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
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
  );
}
