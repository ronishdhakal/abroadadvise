"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import HeroSection from "./HeroSection";
import EventFilters from "./EventFilters";
import EventCard from "./EventCard";
import Pagination from "./Pagination";
import { Search, Filter } from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");
  const [registrationType, setRegistrationType] = useState("");
  const [destination, setDestination] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Fetch destinations for filtering
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/`)
      .then((response) => response.json())
      .then((data) => setDestinations(data.results || []))
      .catch((err) => console.error("Failed to fetch destinations", err));
  }, []);

  // ✅ Fetch events based on filters
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams({ page: currentPage });

        if (search) queryParams.append("search", search);
        if (eventType) queryParams.append("event_type", eventType);
        if (registrationType) queryParams.append("registration_type", registrationType);
        if (destination) queryParams.append("destination", destination);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/event/?${queryParams.toString()}`
        );

        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data.results || []);
        setTotalPages(data.total_pages || Math.ceil((data.count || 0) / 10)); // fallback logic
      } catch (err) {
        console.error("❌ Error fetching events:", err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, eventType, registrationType, destination, currentPage]);

  return (
    <>
      <Head>
        <title>Study Abroad Education Fairs & Events in Nepal - Abroad Advise</title>
        <meta
          name="description"
          content="Explore upcoming education fairs, webinars, and events hosted by top consultancies and universities for Nepalese students."
        />
      </Head>

      <Header />
      <HeroSection />

      {/* ✅ Search + Filter Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-white">
        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <Filter className="h-5 w-5 mr-2" />
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {showFilters && (
          <EventFilters
            eventType={eventType}
            setEventType={setEventType}
            registrationType={registrationType}
            setRegistrationType={setRegistrationType}
            destination={destination}
            setDestination={setDestination}
            destinations={destinations}
          />
        )}
      </div>

      {/* ✅ Event Cards + Pagination */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <p className="text-center text-gray-500 mt-8">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-8">{error}</p>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 mt-8">No events found.</p>
        )}
      </div>

      <Footer />
    </>
  );
}
