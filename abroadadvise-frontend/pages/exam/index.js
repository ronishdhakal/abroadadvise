"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import HeroSection from "./HeroSection"; // ✅ Existing
import ExamFilters from "./ExamFilters"; // ✅ Existing
import ExamCard from "./ExamCard"; // ✅ Existing
import ExamPagination from "./Pagination"; // ✅ Custom pagination component
import { Search, Filter } from "lucide-react";

const ExamList = ({ initialExams, initialTotalPages }) => {
  const [exams, setExams] = useState(initialExams || []);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ Fetch exams based on filters and pagination
  const fetchExams = async () => {
    try {
      const queryParams = new URLSearchParams({ page: currentPage });

      if (search) queryParams.append("search", search); // ✅ Fixed param name
      if (type) queryParams.append("type", type);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exam/?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`Failed to fetch exams: ${response.status}`);

      const data = await response.json();
      setExams(data.results || []);
      setTotalPages(Math.ceil(data.count / 10)); // ✅ Based on backend pagination
    } catch (error) {
      console.error("Error fetching exams:", error.message);
    }
  };

  // ✅ Refetch on filters or pagination change
  useEffect(() => {
    fetchExams();
  }, [search, type, currentPage]);

  return (
    <>
      <Head>
        <title>Standardized & English Proficiency Exams - Abroad Advise</title>
        <meta name="description" content="Find and prepare for the best English proficiency and standardized exams for studying abroad." />
      </Head>

      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search exams..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // ✅ Reset page on new search
              }}
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

        {isFilterOpen && (
          <ExamFilters
            search={search}
            setSearch={setSearch}
            type={type}
            setType={setType}
          />
        )}

        {/* Exam Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {exams.length > 0 ? (
            exams.map((exam) => <ExamCard key={exam.slug} exam={exam} />)
          ) : (
            <p className="text-center col-span-full text-gray-500">No exams found.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <ExamPagination
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

// ✅ Server-side props for initial load
export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exam/?page=1`);
    if (!res.ok) throw new Error("Failed to fetch exams");

    const data = await res.json();

    return {
      props: {
        initialExams: data.results || [],
        initialTotalPages: Math.ceil(data.count / 10) || 1,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error.message);
    return {
      props: {
        initialExams: [],
        initialTotalPages: 1,
      },
    };
  }
}

export default ExamList;
