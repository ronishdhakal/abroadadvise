"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, GraduationCap, BadgeCheck } from "lucide-react";
import { API_BASE_URL } from "@/utils/api";

export default function FeaturedUniversities() {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/university/`);
        const data = await res.json();
        if (data.results) {
          setUniversities(data.results.slice(0, 6));
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
            <GraduationCap className="w-6 h-6 text-[#4c9bd5] mr-2" /> Featured Universities
          </h2>
          <p className="text-gray-600">Explore top institutions worldwide</p>
        </div>
        <Link href="/university">
          <button className="border border-gray-300 rounded-lg px-4 py-2 text-[#4c9bd5] flex items-center hover:bg-[#4c9bd5]/10 transition">
            View All →
          </button>
        </Link>
      </div>

      {/* University Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {universities.map((university) => (
          <Link
            href={`/university/${university.slug}`}
            key={university.id}
            className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Cover Image */}
            <div className="w-full h-28 sm:h-32 md:h-40 relative bg-gray-100">
              {university.cover_photo ? (
                <Image
                  src={university.cover_photo}
                  alt={university.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3 md:p-4">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 flex items-center">
                {university.name}
                {university.verified && (
                  <BadgeCheck
                    className="h-4 w-4 sm:h-5 sm:w-5 text-[#4c9bd5] ml-2"
                    title="Verified University"
                  />
                )}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
                <Globe className="w-4 h-4 mr-1 text-[#4c9bd5]" />
                {university.country || "Location not available"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}