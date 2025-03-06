import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 p-4 h-full">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <nav className="space-y-4">
        <Link href="/consultancy" className="block py-2 px-4 rounded hover:bg-gray-600">
          Consultancies
        </Link>
        <Link href="/university" className="block py-2 px-4 rounded hover:bg-gray-600">
          Universities
        </Link>
        <Link href="/course" className="block py-2 px-4 rounded hover:bg-gray-600">
          Courses
        </Link>
        <Link href="/destination" className="block py-2 px-4 rounded hover:bg-gray-600">
          Destinations
        </Link>
        <Link href="/exam" className="block py-2 px-4 rounded hover:bg-gray-600">
          Exams
        </Link>
        <Link href="/event" className="block py-2 px-4 rounded hover:bg-gray-600">
          Events
        </Link>
        <Link href="/news" className="block py-2 px-4 rounded hover:bg-gray-600">
          News
        </Link>
        <Link href="/about" className="block py-2 px-4 rounded hover:bg-gray-600">
          About
        </Link>
      </nav>
    </div>
  );
}
