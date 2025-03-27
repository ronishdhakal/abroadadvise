import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import { API_BASE_URL } from "@/utils/api";
import {
  Building,
  School,
  Book,
  MapPin,
  CheckSquare,
  RefreshCw,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  // Map labels to icons for stat cards
  const iconMap = {
    Consultancies: <Building className="w-5 h-5 text-[#4c9bd5]" />,
    Universities: <School className="w-5 h-5 text-[#4c9bd5]" />,
    Courses: <Book className="w-5 h-5 text-[#4c9bd5]" />,
    Destinations: <MapPin className="w-5 h-5 text-[#4c9bd5]" />,
    Exams: <CheckSquare className="w-5 h-5 text-[#4c9bd5]" />,
  };

  const fetchCounts = async () => {
    try {
      const urls = [
        { label: "Consultancies", url: `${API_BASE_URL}/consultancy/` },
        { label: "Universities", url: `${API_BASE_URL}/university/` },
        { label: "Courses", url: `${API_BASE_URL}/course/` },
        { label: "Destinations", url: `${API_BASE_URL}/destination/` },
        { label: "Exams", url: `${API_BASE_URL}/exam/` },
      ];

      const results = await Promise.all(
        urls.map(async ({ label, url }) => {
          try {
            const res = await fetch(url);
            const data = await res.json();
            console.log(`✅ ${label} data:`, data);
            return {
              label,
              count: Array.isArray(data) ? data.length : (data?.results?.length || 0),
            };
          } catch (err) {
            console.error(`❌ Failed to fetch ${label}`, err);
            return { label, count: 0 };
          }
        })
      );

      setStats(results);
      // Set the last updated timestamp
      const now = new Date();
      const formattedDateTime = now.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      setLastUpdated(formattedDateTime);
    } catch (err) {
      console.error("🔥 Global fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard | Abroad Advise</title>
        <meta
          name="description"
          content="Welcome to the Abroad Advise admin dashboard. Manage your platform, including consultancies, universities, courses, destinations, exams, and events."
        />
      </Head>

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to the Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Overview of your platform's key metrics
            </p>
          </div>
          <button
            onClick={fetchCounts}
            className="flex items-center gap-2 bg-[#4c9bd5] text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-200 hover:text-[#4c9bd5] transition-all duration-300 sm:w-auto w-full"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Stats
          </button>
        </div>

        {/* Last Updated Info */}
        {lastUpdated && (
          <p className="text-sm text-gray-500 mb-6">
            Last Updated: {lastUpdated}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className="bg-white border-l-4 border-[#4c9bd5] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                {iconMap[item.label]}
                <div>
                  <p className="text-gray-500 text-sm mb-1">{item.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{item.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;