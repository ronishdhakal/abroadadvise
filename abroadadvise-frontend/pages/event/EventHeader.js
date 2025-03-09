"use client";

import { Calendar, Clock, MapPin, DollarSign, BadgeCheck, XCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

const getFullImageUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
};

const EventHeader = ({ event }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEventClosed, setIsEventClosed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Determine if the event is closed based on today's date
  useEffect(() => {
    if (event.date) {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Ensure comparison is based on date only

      setIsEventClosed(eventDate < today); // Event is closed if today is after the event date
    }
  }, [event.date]);

  return (
    <div className="relative w-full flex flex-col justify-end overflow-hidden">
      {/* ✅ Event Cover Photo Section (Ensures No Cropping) */}
      <div className="relative w-full max-w-[2000px] mx-auto flex items-center justify-center bg-gray-100">
        {event.featured_image ? (
          <img
            src={getFullImageUrl(event.featured_image)}
            alt="Event Cover"
            className="w-full h-auto"
            style={{
              maxWidth: "2000px",
              height: "auto",
              objectFit: "contain", // ✅ Ensures full image is visible, no cropping
            }}
          />
        ) : (
          <div className="w-full h-[400px] bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center text-gray-400">
            <span className="text-lg font-light italic">No Cover Photo Available</span>
          </div>
        )}
      </div>

      {/* ✅ Event Info Section */}
      <div
        className={`relative w-full max-w-[2000px] bg-white px-6 sm:px-10 md:px-14 py-6 sm:py-8 flex flex-col gap-6 shadow-lg transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-md"
        }`}
        style={{ marginTop: "-2rem", borderRadius: "15px" }}
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* ✅ Registration Status & Tags */}
          <div className="flex items-center gap-3 flex-wrap">
            {isEventClosed ? (
              <span className="bg-red-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full flex items-center">
                <XCircle className="h-4 w-4 mr-1" /> Registration Closed
              </span>
            ) : (
              <span className="bg-green-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> Registration Open
              </span>
            )}

            <span className="bg-gray-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full">
              {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
            </span>

            {event.price && event.registration_type === "paid" && (
              <span className="bg-yellow-400 text-white text-xs sm:text-sm px-3 py-1 rounded-full">
                NPR {parseFloat(event.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* ✅ Event Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {event.name}
            {event.is_verified && (
              <span className="inline-flex ml-2 items-center" title="Verified Event">
                <BadgeCheck className="h-6 w-6 md:h-7 md:w-7 text-blue-500" />
              </span>
            )}
          </h1>

          {/* ✅ Event Details */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm md:text-base">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              {event.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              {event.time}
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              {event.location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
