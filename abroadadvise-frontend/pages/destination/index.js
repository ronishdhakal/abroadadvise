import { useEffect, useState } from "react";
import Head from "next/head"; // ✅ Import Head for setting the page title
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "./HeroSection";
import DestinationFilters from "./DestinationFilters";
import DestinationCard from "./DestinationCard";
import { Search } from "lucide-react";

const DestinationList = () => {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/`);
        if (!res.ok) throw new Error(`Failed to fetch destinations: ${res.status}`);
        const data = await res.json();
        setDestinations(data.results || []);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("Failed to load destinations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Filter destinations based on search input
  const filteredDestinations = destinations.filter((destination) =>
    destination.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* ✅ Set Page Title & Meta Description */}
      <Head>
        <title>Study Abroad Destinations from Nepal -Abroad Advise</title>
        <meta name="description" content="Explore top study abroad destinations for Nepalese students and plan your international education journey." />
      </Head>

      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        {/* Search Bar (Full Width) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-black text-sm"
            />
          </div>
        </div>

        {/* Loading & Error Handling */}
        {loading && <p className="text-center text-gray-600 mt-4">Loading...</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))
          ) : (
            !loading && <p className="text-gray-500 text-center col-span-full">No destinations found.</p>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DestinationList;
