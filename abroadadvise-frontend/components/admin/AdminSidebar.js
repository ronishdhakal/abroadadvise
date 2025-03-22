import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  Building2,
  School,
  Book,
  MapPin,
  Pencil,
  Calendar,
  Newspaper,
  MessageSquare,
  ListChecks,
} from "lucide-react";

const AdminSidebar = () => {
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);

  useEffect(() => {
    setActive(router.pathname);
  }, [router.pathname]);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Consultancies", path: "/admin/consultancies", icon: <Building2 className="w-4 h-4" /> },
    { name: "Universities", path: "/admin/universities", icon: <School className="w-4 h-4" /> },
    { name: "Courses", path: "/admin/courses", icon: <Book className="w-4 h-4" /> },
    { name: "Destination", path: "/admin/destinations", icon: <MapPin className="w-4 h-4" /> },
    { name: "Exams", path: "/admin/exams", icon: <ListChecks className="w-4 h-4" /> },
    { name: "Events", path: "/admin/events", icon: <Calendar className="w-4 h-4" /> },
    { name: "News", path: "/admin/news", icon: <Newspaper className="w-4 h-4" /> },
    { name: "Blogs", path: "/admin/blogs", icon: <Pencil className="w-4 h-4" /> },
    { name: "Inquiries", path: "/admin/inquiries", icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-full p-5 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path} className="w-full">
                <span
                  className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                    active === item.path
                      ? "bg-gray-800 text-blue-400"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-center text-gray-500 text-xs">
        <p>&copy; {new Date().getFullYear()} Abroad Advise</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
