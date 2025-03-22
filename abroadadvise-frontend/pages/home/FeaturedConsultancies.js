"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, BadgeCheck, Building2 } from "lucide-react";
import { API_BASE_URL } from "@/utils/api";

export default function FeaturedConsultancies() {
  const [consultancies, setConsultancies] = useState([]);

  useEffect(() => {
    const fetchConsultancies = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/consultancy/`);
        const data = await res.json();
        if (data.results) {
          setConsultancies(data.results.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching consultancies:", error);
      }
    };

    fetchConsultancies();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 mt-0">
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

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {consultancies.map((consultancy) => (
          <Link
            key={consultancy.id}
            href={`/consultancy/${consultancy.slug}`}
            className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Mobile: Cover Photo */}
            <div className="block md:hidden w-full h-28 sm:h-32 relative bg-gray-100">
              {consultancy.cover_photo ? (
                <Image
                  src={consultancy.cover_photo}
                  alt={consultancy.name}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Desktop: Logo + Info Side-by-Side */}
            <div className="hidden md:flex items-center px-4 pt-4">
              {/* Square Logo */}
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                {consultancy.logo ? (
                  <Image
                    src={consultancy.logo}
                    alt={consultancy.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>

              {/* Info */}
              <div className="ml-4 flex-1">
                <h3 className="text-base font-semibold text-gray-900 flex items-center">
                  {consultancy.name}
                  {consultancy.verified && (
                    <BadgeCheck className="h-5 w-5 text-blue-500 ml-2" title="Verified Consultancy" />
                  )}
                </h3>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                  {consultancy.address || "Location not available"}
                </p>
              </div>
            </div>

            {/* Info Block (both views) */}
            <div className="p-3 md:pt-2">
              {/* Mobile Text Info (smaller & compact) */}
              <div className="md:hidden">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                  {consultancy.name}
                  {consultancy.verified && (
                    <BadgeCheck className="h-4 w-4 text-blue-500 ml-1" title="Verified Consultancy" />
                  )}
                </h3>
                <p className="text-xs text-gray-600 mt-1 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-gray-500" />
                  {consultancy.address || "Location not available"}
                </p>
              </div>

              {/* Destinations */}
              <div className="flex flex-wrap mt-3 gap-2">
                {consultancy.study_abroad_destinations.length > 5 ? (
                  <>
                    {consultancy.study_abroad_destinations.slice(0, 5).map((destination) => (
                      <Link
                        key={destination.id}
                        href={`/destination/${destination.slug}`}
                        className="px-2 py-0.5 bg-gray-100 text-xs font-medium rounded-md text-gray-700 hover:bg-gray-200"
                      >
                        {destination.title}
                      </Link>
                    ))}
                    <span className="px-2 py-0.5 bg-gray-100 text-xs font-medium rounded-md text-gray-700">
                      +{consultancy.study_abroad_destinations.length - 5}
                    </span>
                  </>
                ) : (
                  consultancy.study_abroad_destinations.map((destination) => (
                    <Link
                      key={destination.id}
                      href={`/destination/${destination.slug}`}
                      className="px-2 py-0.5 bg-gray-100 text-xs font-medium rounded-md text-gray-700 hover:bg-gray-200"
                    >
                      {destination.title}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
