"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import CollegeHeroSection from "./HeroSection";
import CollegeFilters from "./CollegeFilters";
import CollegeCard from "./CollegeCard";
import Pagination from "./Pagination";
import { Search, Filter } from "lucide-react";

const CollegeList = ({ initialColleges, initialTotalPages, destinations, universities }) => {
  const [colleges, setColleges] = useState(initialColleges);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("");
  const [university, setUniversity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchColleges = async () => {
    try {
      const queryParams = new URLSearchParams({ page: currentPage });

      if (search) queryParams.append("name", search);
      if (destination) queryParams.append("destination", destination);
      if (university) queryParams.append("university", university);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/college/?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch colleges: ${res.status}`);

      const data = await res.json();
      setColleges(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error("Error fetching colleges:", error.message);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [search, destination, university, currentPage]);

  return (
    <>
      <Head>
        <title>Top Colleges for Studying Abroad - Abroad Advise</title>
        <meta
          name="description"
          content="Discover internationally affiliated colleges for studying abroad. Filter by destination and university."
        />
      </Head>

      <Header />
      <CollegeHeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        {/* 🔍 Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search colleges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-black text-sm"
            />
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Filter className="h-5 w-5 mr-2" />
            {isFilterOpen ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {/* 🧩 Filters */}
        {isFilterOpen && (
          <CollegeFilters
            search={search}
            setSearch={setSearch}
            destination={destination}
            setDestination={setDestination}
            university={university}
            setUniversity={setUniversity}
            destinations={destinations}
            universities={universities}
          />
        )}

        {/* 📦 College List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {colleges.length > 0 ? (
            colleges.map((college) => (
              <CollegeCard key={college.slug} college={college} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No colleges found.</p>
          )}
        </div>

        {/* 📄 Pagination */}
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

export async function getServerSideProps() {
  try {
    const [collegeRes, destRes, uniRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/college/?page=1`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/university/`),
    ]);

    if (!collegeRes.ok || !destRes.ok || !uniRes.ok) throw new Error("API call failed");

    const [collegeData, destinationData, universityData] = await Promise.all([
      collegeRes.json(),
      destRes.json(),
      uniRes.json(),
    ]);

    return {
      props: {
        initialColleges: collegeData.results || [],
        initialTotalPages: Math.ceil(collegeData.count / 10),
        destinations: destinationData.results || [],
        universities: universityData.results || [],
      },
    };
  } catch (error) {
    console.error("Error loading colleges:", error.message);
    return {
      props: {
        initialColleges: [],
        initialTotalPages: 1,
        destinations: [],
        universities: [],
      },
    };
  }
}

export default CollegeList;
