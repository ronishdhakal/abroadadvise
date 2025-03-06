import Link from "next/link";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-black">🎓 Abroad Advise</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-6 text-gray-800 font-medium">
        <Link href="/consultancy" className="hover:text-blue-600">Consultancy</Link>
        <Link href="/university" className="hover:text-blue-600">University</Link>
        <Link href="/course" className="hover:text-blue-600">Course</Link>
        <Link href="/destination" className="hover:text-blue-600">Destination</Link>
        <Link href="/exam" className="hover:text-blue-600">Exam</Link>
        <Link href="/event" className="hover:text-blue-600">Event</Link>
        <Link href="/news" className="hover:text-blue-600">News</Link>
      </nav>

      {/* Right Side Icons & Buttons */}
      <div className="flex items-center space-x-4">
        <FiSearch className="text-gray-500 cursor-pointer text-xl hover:text-blue-600 transition" />
        <Link href="/login" className="border px-4 py-2 rounded-md hover:bg-gray-100 transition">Log in</Link>
        <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition">Sign up</Link>
      </div>
    </header>
  );
}
