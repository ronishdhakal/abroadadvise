"use client";

import { useState, useEffect } from "react";
import ConsultancySidebar from "./ConsultancySidebar";
import { fetchConsultancyDashboard } from "@/utils/api";
import { Users, BookOpen, Globe } from "lucide-react";

const ConsultancyDashboard = () => {
  const [consultancy, setConsultancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch Consultancy Details
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching consultancy data...");
        const consultancyData = await fetchConsultancyDashboard();
        setConsultancy(consultancyData);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center py-6 text-gray-600">Loading...</p>;
  if (error) return <p className="text-center py-6 text-red-600">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <ConsultancySidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {consultancy?.name}</h1>
        <p className="text-gray-600 mt-2">Manage your consultancy details here.</p>

        {/* Quick Stats Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Partner Universities */}
          <div className="bg-white p-6 shadow-lg rounded-lg flex items-center gap-4">
            <Users className="w-10 h-10 text-green-600" />
            <div>
              <h2 className="text-xl font-semibold">{consultancy?.partner_universities?.length || 0}</h2>
              <p className="text-gray-600">Partner Universities</p>
            </div>
          </div>

          {/* Study Destinations */}
          <div className="bg-white p-6 shadow-lg rounded-lg flex items-center gap-4">
            <Globe className="w-10 h-10 text-purple-600" />
            <div>
              <h2 className="text-xl font-semibold">{consultancy?.study_abroad_destinations?.length || 0}</h2>
              <p className="text-gray-600">Study Destinations</p>
            </div>
          </div>

          {/* Test Preparation */}
          <div className="bg-white p-6 shadow-lg rounded-lg flex items-center gap-4">
            <BookOpen className="w-10 h-10 text-orange-600" />
            <div>
              <h2 className="text-xl font-semibold">{consultancy?.test_preparation?.length || 0}</h2>
              <p className="text-gray-600">Test Preparation Courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultancyDashboard;
