"use client";

import { useEffect, useState } from "react";
import EventCard from "@/pages/event/EventCard";
import { CalendarDays } from "lucide-react";

const ConsultancyEvent = ({ slug }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!slug) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/event/active/`);
        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        const filtered = data.filter((event) => event.organizer?.slug === slug);
        setEvents(filtered);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [slug, API_URL]);

  return (
    <section
      className="bg-white p-5 rounded-xl shadow border border-gray-200"
      aria-labelledby="consultancy-events-heading"
      aria-busy={loading}
    >
      <h2
        id="consultancy-events-heading"
        className="text-lg font-bold flex items-center gap-2 text-gray-800 mb-4"
      >
        <CalendarDays className="h-5 w-5 text-[#4c9bd5]" aria-hidden="true" />
        Upcoming Events
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500" role="status">
          Loading events...
        </p>
      ) : error ? (
        <p className="text-sm text-red-500" role="alert">
          Failed to load events. Please try again later.
        </p>
      ) : events.length === 0 ? (
        <p className="text-sm text-gray-500">
          No active events from this consultancy.
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ConsultancyEvent;
