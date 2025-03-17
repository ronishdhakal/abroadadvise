"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, BadgeCheck, Building2 } from "lucide-react"; // ✅ Added Building2 icon

export default function FeaturedConsultancies() {
  const [consultancies, setConsultancies] = useState([]);

  useEffect(() => {
    const fetchConsultancies = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/consultancy/");
        const data = await res.json();
        if (data.results) {
          setConsultancies(data.results.slice(0, 3)); // Show only 3 consultancies
        }
      } catch (error) {
        console.error("Error fetching consultancies:", error);
      }
    };

    fetchConsultancies();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-0 mt-0 mb-0">
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
            <Building2 className="w-6 h-6 text-blue-600 mr-2" /> Featured Consultancies
          </h2>
          <p className="text-gray-600">Connect with trusted education consultants</p>
        </div>
        <Link href="/consultancy">
          <button className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 flex items-center hover:bg-gray-100 transition">
            View All →
          </button>
        </Link>
      </div>

      {/* Consultancy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {consultancies.map((consultancy) => (
          <div
            key={consultancy.id}
            className="bg-white shadow-sm rounded-lg p-6 border flex flex-col justify-between h-full"
          >
            {/* Logo & Name */}
            <div className="flex items-center space-x-4">
              {/* ✅ Logo now links to detail page */}
              <Link href={`/consultancy/${consultancy.slug}`} className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                {consultancy.logo ? (
                  <Image
                    src={consultancy.logo}
                    alt={consultancy.name}
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </Link>

              <div>
                {/* ✅ Name now links to detail page */}
                <Link href={`/consultancy/${consultancy.slug}`} className="hover:underline flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{consultancy.name}</h3>
                  {consultancy.verified && (  // ✅ Changed from is_verified to verified
  <span className="ml-2 text-blue-500" title="Verified Consultancy">
    <BadgeCheck className="h-5 w-5" />
  </span>
)}

                </Link>
                <p className="text-gray-600 text-sm flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                  {consultancy.address || "Location not available"}
                </p>
              </div>
            </div>

            {/* Destinations */}
            <div className="flex flex-wrap mt-4 gap-2">
              {consultancy.study_abroad_destinations.length > 5 ? (
                <>
                  {consultancy.study_abroad_destinations.slice(0, 5).map((destination) => (
                    <Link
                      key={destination.id}
                      href={`/destination/${destination.slug}`}
                      className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-200"
                    >
                      {destination.title}
                    </Link>
                  ))}
                  <span className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-md text-gray-700">
                    +{consultancy.study_abroad_destinations.length - 5}
                  </span>
                </>
              ) : (
                consultancy.study_abroad_destinations.map((destination) => (
                  <Link
                    key={destination.id}
                    href={`/destination/${destination.slug}`}
                    className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-200"
                  >
                    {destination.title}
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
