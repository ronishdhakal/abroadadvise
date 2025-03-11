import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

const AdminSidebar = () => {
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Consultancies", path: "/admin/consultancies" },
    { name: "Universities", path: "/admin/universities" },
    { name: "Courses", path: "/admin/courses" },
    { name: "Exams", path: "/admin/exams" },
    { name: "Events", path: "/admin/events" },
    { name: "News", path: "/admin/news" },
    { name: "Blogs", path: "/admin/blogs" },
    { name: "Inquiries", path: "/admin/inquiries" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-full p-5">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
      <nav>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <span
                  className={`block p-3 rounded cursor-pointer ${
                    active === item.path ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
