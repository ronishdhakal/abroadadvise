"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, GraduationCap, BadgeCheck } from "lucide-react"; // ✅ Elegant icons

export default function FeaturedUniversities() {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/university/");
        const data = await res.json();
        if (data.results) {
          setUniversities(data.results.slice(0, 6)); // Get only 6 universities
        }
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 mt-0">
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
            <GraduationCap className="w-6 h-6 text-blue-600 mr-2" /> Featured Universities
          </h2>
          <p className="text-gray-600">Explore top institutions worldwide</p>
        </div>
        <Link href="/university">
          <button className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 flex items-center hover:bg-gray-100 transition">
            View All →
          </button>
        </Link>
      </div>

      {/* University Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {universities.map((university) => (
          <div
            key={university.id}
            className="bg-white shadow-md rounded-lg p-6 border flex flex-col justify-between hover:shadow-lg transition-all duration-300"
          >
            {/* Logo & Name */}
            <div className="flex items-center space-x-4">
              {/* ✅ Logo now links to detail page */}
              <Link href={`/university/${university.slug}`} className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                {university.logo ? (
                  <Image
                    src={university.logo}
                    alt={university.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </Link>

              {/* University Name & Location */}
              <div className="flex-1">
                {/* ✅ Name now links to detail page */}
                <Link href={`/university/${university.slug}`} className="hover:underline flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{university.name}</h3>
                  {university.verified && (
                    <span className="ml-2 text-blue-500" title="Verified University">
                      <BadgeCheck className="h-5 w-5" />
                    </span>
                  )}
                </Link>
                <p className="text-gray-600 text-sm flex items-center">
                  <Globe className="w-4 h-4 text-gray-500 mr-1" />
                  {university.country || "Location not available"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
