"use client";

import { Calendar, Clock, MapPin, Building, Tag, Users } from "lucide-react";
import Link from "next/link";

const EventOverview = ({ event }) => {
  return (
    <div className="w-full bg-white shadow-sm rounded-2xl p-8 border border-gray-200">
      {/* ✅ Responsive Grid Layout (Side-by-side on Desktop, Stacked on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* ✅ Event Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Event Information</h2>
          <div className="space-y-4 text-gray-700 text-[15px] leading-relaxed">
            
            {/* ✅ Date & Duration */}
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Date & Duration</p>
                <p className="text-gray-600">
                  {event.date
                    ? new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not specified"}{" "}
                  {event.duration ? `(${event.duration})` : ""}
                </p>
              </div>
            </div>

            {/* ✅ Time */}
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Time</p>
                <p className="text-gray-600">{event.time || "To be announced"}</p>
              </div>
            </div>

            {/* ✅ Location */}
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-gray-600">{event.location || "Online / To be announced"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Organizer & Destinations */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Organizer & Destinations</h2>
          <div className="space-y-6 text-gray-700 text-[15px] leading-relaxed">
            
            {/* ✅ Organizer (Now Clickable to Consultancy or University) */}
            <div className="flex items-center">
              <Building className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Organized by</p>
                {event.organizer && event.organizer.slug ? (
                  <Link
                    href={`/${event.organizer.type}/${event.organizer.slug}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {event.organizer.name}
                  </Link>
                ) : (
                  <span className="text-gray-500">Not specified</span>
                )}
              </div>
            </div>

            {/* ✅ Targeted Destinations (Now Clickable) */}
            <div>
              <div className="flex items-center mb-2">
                <Tag className="h-5 w-5 mr-3 text-gray-400" />
                <p className="font-medium text-gray-900">Targeted Destinations</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.targeted_destinations?.length > 0 ? (
                  event.targeted_destinations.map((destination, index) => (
                    <Link
                      key={index}
                      href={`/destination/${destination.slug}`}
                      className="px-3 py-1 bg-gray-100 text-blue-600 rounded-full text-sm font-medium hover:underline"
                    >
                      {destination.title}
                    </Link>
                  ))
                ) : (
                  <span className="text-gray-500">No destinations available</span>
                )}
              </div>
            </div>

            {/* ✅ Participating Universities (Now Clickable) */}
            <div>
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 mr-3 text-gray-400" />
                <p className="font-medium text-gray-900">Participating Universities</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.related_universities?.length > 0 ? (
                  event.related_universities.map((university, index) => (
                    <Link
                      key={index}
                      href={`/university/${university.slug}`}
                      className="px-3 py-1 bg-gray-100 text-blue-600 rounded-full text-sm font-medium hover:underline"
                    >
                      {university.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-gray-500">No universities listed</span>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default EventOverview;
