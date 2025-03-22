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
      .then((data) => {
        setDestinations(data.results || []);
      })
      .catch((err) => console.error("Failed to fetch destinations", err));
  }, []);

  // ✅ Fetch events based on filters
  useEffect(() => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/?page=${currentPage}&search=${search}&event_type=${eventType}&registration_type=${registrationType}&destination=${destination}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data.results);
        setTotalPages(data.total_pages || 1);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [search, eventType, registrationType, destination, currentPage]);

  return (
    <>
      <Head>
        <title>Study Abroad Education Fairs & Events in Nepal - Abroad Advise</title>
      </Head>
      <Header />
      <HeroSection />

      {/* ✅ Search & Filter Section (No Duplication) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-white">
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
              aria-label="Search Events"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <Filter className="h-5 w-5 mr-2" />
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {/* ✅ Filters Section (No Extra Search Bar) */}
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

      {/* ✅ Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 mt-8">Loading events...</p>
      ) : (
        <>
          {/* ✅ Show events only if available */}
          {events.length > 0 ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-8">No events found.</p>
          )}

          {/* ✅ Show Pagination only if more than one page */}
          {totalPages > 1 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      <Footer />
    </>
  );
}
