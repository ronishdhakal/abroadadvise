"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/utils/api";
import { User, MessageSquare, Home } from "lucide-react";

const sections = [
  {
    title: "Consultancy",
    items: [
      { key: "home", label: "Home", href: "/dashboard/consultancy/", icon: <Home className="w-4 h-4" /> },
      { key: "profile", label: "Profile", href: "/dashboard/consultancy/profile", icon: <User className="w-4 h-4" /> },
      { key: "inquiries", label: "Inquiries", href: "/dashboard/consultancy/inquiries", icon: <MessageSquare className="w-4 h-4" /> },
    ],
  },
];

const ConsultancySidebar = () => {
  const pathname = usePathname(); // Get the current route
  const [siteLogo, setSiteLogo] = useState(null);

  // Fetch Site Logo
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

  return (
    <aside className="w-64 bg-gray-50 text-gray-800 h-screen p-6 flex flex-col shadow-sm sticky top-0">
      {/* Logo Section */}
      <div className="mb-10 flex items-center justify-start">
        {siteLogo ? (
          <img src={siteLogo} alt="Abroad Advise Logo" className="w-32 h-10 object-contain" />
        ) : (
          <div className="w-32 h-10 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-2xl font-bold text-[#4c9bd5]">AA</span>
          </div>
        )}
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

export default ConsultancySidebar;