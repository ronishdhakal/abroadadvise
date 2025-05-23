"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MessageSquare, Home } from "lucide-react";

const sections = [
  {
    title: "College",
    items: [
      { key: "home", label: "Home", href: "/dashboard/college/", icon: <Home className="w-4 h-4" /> },
      { key: "profile", label: "Profile", href: "/dashboard/college/profile", icon: <User className="w-4 h-4" /> },
      { key: "inquiries", label: "Inquiries", href: "/dashboard/college/inquiries", icon: <MessageSquare className="w-4 h-4" /> },
    ],
  },
];

const CollegeSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-50 text-gray-800 h-screen p-6 flex flex-col shadow-sm sticky top-0 z-30">
      {/* Logo Section */}
      <div className="mb-10 flex items-center justify-start">
        <img
          src="/logo/default-logo.png"
          alt="Abroad Advise Logo"
          className="w-32 h-10 object-contain transition-all duration-300 hover:opacity-90"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        {sections.map((group, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {group.title}
            </h2>
            <ul className="space-y-1">
              {group.items.map(({ key, label, href, icon }) => (
                <li key={key}>
                  <Link href={href} className="w-full">
                    <span
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        pathname === href
                          ? "bg-[#4c9bd5] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-200 hover:text-[#4c9bd5]"
                      }`}
                    >
                      {icon}
                      <span className="text-sm font-medium">{label}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto text-center text-gray-500 text-xs">
        <p>© {new Date().getFullYear()}</p>
        <p className="mt-1 text-[#4c9bd5] font-medium">Abroad Advise</p>
      </div>
    </aside>
  );
};

export default CollegeSidebar;
