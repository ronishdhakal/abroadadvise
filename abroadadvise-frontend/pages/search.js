"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Search } from "lucide-react";

import ConsultancyCard from "@/pages/consultancy/ConsultancyCard";
import UniversityCard from "@/pages/university/UniversityCard";
import CourseCard from "@/pages/course/CourseCard";
import CollegeCard from "@/pages/college/CollegeCard";
import DestinationCard from "@/pages/destination/DestinationCard";
import ExamCard from "@/pages/exam/ExamCard";

export default function SearchResults() {
  const router = useRouter();
  const { query } = router.query;

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query || "");
  const [suggestion, setSuggestion] = useState(null);
  const [topResult, setTopResult] = useState(null); // ✅ New

  const fetchSearchResults = useCallback(async (searchTerm) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/search/?query=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      setResults(data.results);
      setSuggestion(data.suggestion || null);
      setTopResult(data.top_result || null);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query, fetchSearchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSuggestionClick = () => {
    if (suggestion) {
      router.push(`/search?query=${encodeURIComponent(suggestion)}`);
    }
  };

  const renderSection = (title, data, Component, key) =>
    data?.length > 0 && (
      <Section key={key} title={title}>
        {data.map((item) => (
          <Component key={item.id} {...{ [key]: item }} />
        ))}
      </Section>
    );

  const getOrderedSections = () => {
    if (!results) return [];

    const allSections = [
      { title: "Consultancies", key: "consultancy", data: results.consultancies, Component: ConsultancyCard },
      { title: "Universities", key: "university", data: results.universities, Component: UniversityCard },
      { title: "Colleges", key: "college", data: results.colleges, Component: CollegeCard },
      { title: "Courses", key: "course", data: results.courses, Component: CourseCard },
      { title: "Destinations", key: "destination", data: results.destinations, Component: DestinationCard },
      { title: "Exams", key: "exam", data: results.exams, Component: ExamCard },
    ];

    if (topResult) {
      const matchIndex = allSections.findIndex((s) => s.key + "s" === topResult);
      if (matchIndex > 0) {
        const [best] = allSections.splice(matchIndex, 1);
        allSections.unshift(best);
      }
    }

    return allSections;
  };

  return (
    <>
      <Head>
        <title>Search Results - Abroad Advise</title>
        <meta name="description" content={`Search results for "${query}" on Abroad Advise`} />
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search universities, consultancies, courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-black text-sm"
          />
        </form>

        {/* Results Section */}
        <div className="mt-8">
          <h1 className="text-2xl font-semibold mb-2 text-gray-800">
            {`Search Results for "${query}"`}
          </h1>

          {/* ✅ Did You Mean Suggestion */}
          {!loading && suggestion && (
            <p className="text-gray-600 mb-6">
              Did you mean{" "}
              <button
                onClick={handleSuggestionClick}
                className="text-blue-600 hover:underline font-medium"
              >
                {suggestion}
              </button>
              ?
            </p>
          )}

          {loading && <p className="text-center text-gray-600">Loading...</p>}

          {results && Object.values(results).every((arr) => arr.length === 0) && (
            <p className="text-center text-gray-500">No results found.</p>
          )}

          {/* All Sections */}
          {!loading && results &&
            getOrderedSections().map((section) =>
              renderSection(section.title, section.data, section.Component, section.key)
            )}
        </div>
      </main>

      <Footer />
    </>
  );
}

/** ✅ Section Wrapper Component */
const Section = ({ title, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {children}
    </div>
  </div>
);
