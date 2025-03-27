"use client";

import Link from "next/link";

const DestinationOtherDestinations = ({ destinations = [], currentSlug }) => {
  // ✅ Filter out the current destination safely
  const otherDestinations = Array.isArray(destinations)
    ? destinations.filter((dest) => dest?.slug !== currentSlug).slice(0, 6)
    : [];

  if (otherDestinations.length === 0) {
    return null; // ✅ Hide section if no other destinations
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-5xl mx-auto mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Explore Other Study Destinations</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {otherDestinations.map((destination) => (
          <div key={destination?.slug || destination?.id} className="flex flex-col bg-gray-100 rounded-lg p-4 shadow">
            <div className="flex items-center gap-3">
              {destination?.country_logo ? (
                <img
                  src={destination.country_logo}
                  alt={destination?.title || "Country Logo"}
                  className="h-12 w-12 object-cover rounded-md"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-300 rounded-md"></div>
              )}

              <div>
                <Link
                  href={`/destination/${destination?.slug}`}
                  className="text-sm font-medium text-gray-800 hover:text-blue-600"
                >
                  {destination?.title || "Untitled Destination"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/destination/">
          <button className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
            View More Destinations
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DestinationOtherDestinations;
