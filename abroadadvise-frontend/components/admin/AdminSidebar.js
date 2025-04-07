import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_BASE_URL } from "@/utils/api";
import {
  LayoutDashboard,
  Building,
  School,
  Book,
  MapPin,
  Pencil,
  Calendar,
  Newspaper,
  MessageSquare,
  CheckSquare,
  Users,
} from "lucide-react";

const AdminSidebar = () => {
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);
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

  useEffect(() => {
    setActive(router.pathname);
  }, [router.pathname]);

  const menuGroups = [
    {
      title: "Management",
      items: [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: "Consultancies", path: "/admin/consultancies", icon: <Building className="w-4 h-4" /> },
        { name: "Universities", path: "/admin/universities", icon: <School className="w-4 h-4" /> },
        { name: "Colleges", path: "/admin/colleges", icon: <School className="w-4 h-4" /> },
        { name: "Courses", path: "/admin/courses", icon: <Book className="w-4 h-4" /> },
        { name: "Destination", path: "/admin/destinations", icon: <MapPin className="w-4 h-4" /> },
        { name: "Exams", path: "/admin/exams", icon: <CheckSquare className="w-4 h-4" /> },
        { name: "Scholarships", path: "/admin/scholarships", icon: <CheckSquare className="w-4 h-4" /> },
        { name: "Configurations", path: "/admin/configurations", icon: <Pencil className="w-4 h-4" /> },
        { name: "Featured", path: "/admin/featureds", icon: <Pencil className="w-4 h-4" /> },
        { name: "Inquiries", path: "/admin/inquiries", icon: <MessageSquare className="w-4 h-4" /> },
      ],
    },
    {
      title: "Marketing & Social",
      items: [
        { name: "Events", path: "/admin/events", icon: <Calendar className="w-4 h-4" /> },
        { name: "News", path: "/admin/news", icon: <Newspaper className="w-4 h-4" /> },
        { name: "Blogs", path: "/admin/blogs", icon: <Pencil className="w-4 h-4" /> },
      ],
    },
    {
      title: "Users",
      items: [
        { name: "Users", path: "/admin/users", icon: <Users className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside className="w-64 md:w-56 sm:w-full bg-gray-50 text-gray-800 h-screen p-6 flex flex-col shadow-sm sm:p-4">
      {/* Logo Section */}
      <div className="mb-10 flex items-center justify-start">
        {siteLogo ? (
          <img src={siteLogo} alt="Abroad Advise Logo" className="w-32 h-10 object-contain sm:w-28 sm:h-8" />
        ) : (
          <div className="w-32 h-10 bg-gray-200 rounded flex items-center justify-center sm:w-28 sm:h-8">
            <span className="text-2xl font-bold text-[#4c9bd5] sm:text-xl">AA</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        {menuGroups.map((group, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {group.title}
            </h2>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="w-full">
                    <span
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        active === item.path
                          ? "bg-[#4c9bd5] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-200 hover:text-[#4c9bd5]"
                      }`}
                    >
                      {item.icon}
                      <span className="text-sm font-medium sm:text-xs">{item.name}</span>
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
        <p className="mt-1 text-[#4c9bd5] font-medium">Empowering Global Education</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;