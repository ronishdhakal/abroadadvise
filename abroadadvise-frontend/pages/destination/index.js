"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "./HeroSection";
import DestinationCard from "./DestinationCard";
import Pagination from "./Pagination"; // ✅ Your reusable pagination component
import { Search } from "lucide-react";

const DestinationList = () => {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch destinations from API with pagination + search
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage });
      if (search) params.append("search", search);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch destinations: ${res.status}`);
      const data = await res.json();
      setDestinations(data.results || []);
      setTotalPages(Math.ceil(data.count / 10)); // Adjust based on backend page size
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError("Failed to load destinations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [currentPage, search]);

  return (
    <>
      {/* ✅ SEO Meta Tags */}
      <Head>
        <title>Study Abroad Destinations from Nepal - Abroad Advise</title>
        <meta
          name="description"
          content="Explore top study abroad destinations for Nepalese students and plan your international education journey."
        />
      </Head>

      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        {/* ✅ Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // ✅ Reset to first page on search
              }}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-black text-sm"
            />
          </div>
        </div>

        {/* ✅ Loading & Error */}
        {loading && <p className="text-center text-gray-600 mt-4">Loading...</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* ✅ Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {destinations.length > 0 ? (
            destinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))
          ) : (
            !loading && (
              <p className="text-gray-500 text-center col-span-full">
                No destinations found.
              </p>
            )
          )}
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      <Footer />
    </>
  );
};

export default DestinationList;
