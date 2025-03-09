"use client";

import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

const EventOther = ({ otherEvents }) => {
  if (!Array.isArray(otherEvents) || otherEvents.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-xl p-5 border w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Other Active Events</h2>
        <p className="text-gray-600 text-sm">No active events available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-5 border w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Other Active Events</h2>

      <div className="space-y-4">
        {otherEvents.map((event) => (
          <Link key={event.id} href={`/event/${event.slug}`} className="block bg-gray-50 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative w-full h-32 bg-gray-200 flex items-center justify-center">
              {event.featured_image ? (
                <img src={event.featured_image} alt={event.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400">No Image</div>
              )}
              <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-900">{event.name}</h3>

              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {event.date}
              </div>

              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                {event.location}
              </div>

              {/* Price Display */}
              {event.registration_type === "free" ? (
                <span className="text-green-600 font-medium text-sm mt-2 block">Free Event</span>
              ) : (
                <span className="text-yellow-600 font-medium text-sm mt-2 block">
                  ${parseFloat(event.price).toFixed(2)}
                </span>
              )}

              <button className="mt-3 w-full py-2 text-center border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                Details
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventOther;
