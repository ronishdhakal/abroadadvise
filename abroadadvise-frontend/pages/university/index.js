"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import HeroSection from "./HeroSection";
import UniversityFilters from "./UniversityFilters";
import UniversityCard from "./UniversityCard";
import { Search, Filter } from "lucide-react";
import Pagination from "../consultancy/Pagination"; // Import the Pagination component

const UniversityList = ({ initialUniversities, initialTotalPages, disciplines }) => {
  const [universities, setUniversities] = useState(initialUniversities);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ Fetch universities based on filters
  const fetchUniversities = async () => {
    try {
      const queryParams = new URLSearchParams({ page: currentPage });

      if (searchQuery) queryParams.append("search", searchQuery);
      if (countryQuery) queryParams.append("country", countryQuery);
      if (selectedDisciplines.length > 0) {
        queryParams.append("disciplines", selectedDisciplines.map(d => d.value).join(","));
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/university/?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`Failed to fetch universities: ${response.status}`);

      const data = await response.json();
      setUniversities(data.results || []);
      setTotalPages(Math.ceil(data.count / 10)); // ✅ Updated for paginated API
    } catch (error) {
      console.error("Error fetching universities:", error.message);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [searchQuery, countryQuery, selectedDisciplines, currentPage]);

  return (
    <>
      <Head>
        <title>Best Universities for Nepalese Students to Study Abroad - Abroad Advise</title>
        <meta name="description" content="Explore top study abroad universities for Nepalese students and plan your international education journey." />
      </Head>

      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search universities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-black text-sm"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Filter className="h-5 w-5 mr-2" />
            {isFilterOpen ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {/* Filters Section */}
        {isFilterOpen && (
          <UniversityFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            countryQuery={countryQuery}
            setCountryQuery={setCountryQuery}
            selectedDisciplines={selectedDisciplines}
            setSelectedDisciplines={setSelectedDisciplines}
            disciplines={disciplines}
          />
        )}

        {/* University Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {universities.length > 0 ? (
            universities.map((university) => (
              <UniversityCard key={university.slug} university={university} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No universities found.</p>
          )}
        </div>

        {/* Pagination */}
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

// ✅ Server-side Data Fetching (SSR)
export async function getServerSideProps() {
  try {
    const [response, disciplinesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/university/?page=1`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/discipline/`)
    ]);

    if (!response.ok || !disciplinesRes.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    const disciplines = await disciplinesRes.json();

    return {
      props: {
        initialUniversities: data.results || [],
        initialTotalPages: Math.ceil(data.count / 10) || 1, // ✅ Updated to use count
        disciplines: disciplines.results || [],
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return {
      props: {
        initialUniversities: [],
        initialTotalPages: 1,
        disciplines: [],
      },
    };
  }
}

export default UniversityList;
