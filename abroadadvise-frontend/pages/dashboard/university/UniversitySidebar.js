"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MessageSquare } from "lucide-react";

const sections = [
  { key: "profile", label: "Profile", href: "/dashboard/university/profile", icon: <User className="w-5 h-5" /> },
  { key: "inquiries", label: "Inquiries", href: "/dashboard/university/inquiries", icon: <MessageSquare className="w-5 h-5" /> },
];

const UniversitySidebar = () => {
  const pathname = usePathname(); // Get the current route

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-xl font-bold mb-6">University Dashboard</h2>
      <ul className="space-y-4">
        {sections.map(({ key, label, href, icon }) => (
          <li key={key}>
            <Link
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === href ? "bg-blue-600" : "hover:bg-gray-800"
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UniversitySidebar;
