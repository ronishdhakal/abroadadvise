"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Monitor, Users, RefreshCw } from "lucide-react";
import { API_BASE_URL } from "@/utils/api";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/event/`);
        const data = await res.json();
        setEvents(data.results.slice(0, 3));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const getEventTypeBadge = (eventType) => {
    switch (eventType.toLowerCase()) {
      case "online":
        return { text: "Online", bgColor: "bg-[#4c9bd5]/10", textColor: "text-[#4c9bd5]", icon: <Monitor className="w-4 h-4 mr-1" /> };
      case "hybrid":
        return { text: "Hybrid", bgColor: "bg-[#4c9bd5]/10", textColor: "text-[#4c9bd5]", icon: <RefreshCw className="w-4 h-4 mr-1" /> };
      case "physical":
        return { text: "In Person", bgColor: "bg-[#4c9bd5]/10", textColor: "text-[#4c9bd5]", icon: <Users className="w-4 h-4 mr-1" /> };
      default:
        return { text: "Event", bgColor: "bg-[#4c9bd5]/10", textColor: "text-[#4c9bd5]", icon: <Calendar className="w-4 h-4 mr-1" /> };
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 mt-0 mb-0">
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 text-[#4c9bd5] mr-2" /> Upcoming Events
          </h2>
          <p className="text-gray-600">Join our educational events and fairs</p>
        </div>
        <Link href="/event">
          <button className="border border-gray-300 rounded-lg px-4 py-2 text-[#4c9bd5] flex items-center hover:bg-[#4c9bd5]/10 transition">
            View All →
          </button>
        </Link>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => {
          const eventType = getEventTypeBadge(event.event_type);
          return (
            <div key={event.id} className="bg-white shadow-md rounded-lg border hover:shadow-lg transition-all duration-300">
              {/* Image links to detail page */}
              <Link href={`/event/${event.slug}`}>
                <Image
                  src={event.featured_image || "/placeholder.jpg"}
                  alt={event.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </Link>

              <div className="p-4">
                {/* Event Type Badge */}
                <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full mb-2 ${eventType.bgColor} ${eventType.textColor}`}>
                  {eventType.icon} {eventType.text}
                </span>

                {/* Title links to detail page */}
                <Link href={`/event/${event.slug}`} className="hover:underline">
                  <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                </Link>

                <p className="text-gray-500 text-sm flex items-center mt-1">
                  By {event.organizer?.name || "Unknown Organizer"}
                </p>

                <p className="text-gray-700 text-sm flex items-center mt-1">
                  <Calendar className="w-4 h-4 text-[#4c9bd5] mr-1" />
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}