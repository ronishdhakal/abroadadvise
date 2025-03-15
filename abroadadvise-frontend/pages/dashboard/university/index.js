"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/utils/authGuard";
import UniversitySidebar from "./UniversitySidebar"; 
import { Users, BookOpen, Globe, GraduationCap } from "lucide-react";
import { fetchUniversityDashboard } from "@/utils/api";

const UniversityDashboard = () => {
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false); // ✅ Prevent hydration error

  // ✅ Prevent server/client mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch University Data
  useEffect(() => {
    if (!mounted) return; // ✅ Fetch only after mount

    const fetchData = async () => {
      try {
        console.log("Fetching university data...");
        const universityData = await fetchUniversityDashboard();
        setUniversity(universityData);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted]);

  if (!mounted) return null; // ✅ Avoid hydration errors

  if (loading) return <p className="text-center py-6 text-gray-600">Loading...</p>;
  if (error) return <p className="text-center py-6 text-red-600">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <UniversitySidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {university?.name}</h1>
        <p className="text-gray-600 mt-2">Manage your university details here.</p>

        {/* ✅ Quick Stats Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Courses */}
          <div className="bg-white p-6 shadow-lg rounded-lg flex items-center gap-4">
            <BookOpen className="w-10 h-10 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">{university?.courses?.length || 0}</h2>
              <p className="text-gray-600">Courses Offered</p>
            </div>
          </div>

          {/* Partner Consultancies */}
          <div className="bg-white p-6 shadow-lg rounded-lg flex items-center gap-4">
            <Users className="w-10 h-10 text-green-600" />
            <div>
              <h2 className="text-xl font-semibold">{university?.partner_consultancies?.length || 0}</h2>
              <p className="text-gray-600">Partner Consultancies</p>
            </div>
          </div>

          {/* Study Destinations */}
          <div className="bg-white p-6 shadow-lg rounded-lg flex items-center gap-4">
            <Globe className="w-10 h-10 text-purple-600" />
            <div>
              <h2 className="text-xl font-semibold">{university?.study_abroad_destinations?.length || 0}</h2>
              <p className="text-gray-600">Study Destinations</p>
            </div>
          </div>

          {/* Total Students */}
          <div className="bg-white p-6 shadow-lg rounded-lg flex items-center gap-4">
            <GraduationCap className="w-10 h-10 text-orange-600" />
            <div>
              <h2 className="text-xl font-semibold">{university?.students_enrolled || "N/A"}</h2>
              <p className="text-gray-600">Students Enrolled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Protect the route for university users only
export default AuthGuard(UniversityDashboard, ["university"]);
