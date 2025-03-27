import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Search } from "lucide-react";
import ConsultancyCard from "@/pages/consultancy/ConsultancyCard";
import UniversityCard from "@/pages/university/UniversityCard";
import CourseCard from "@/pages/course/CourseCard";

export default function SearchResults() {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query || "");

  const fetchSearchResults = useCallback(async (searchTerm) => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/search/?query=${searchTerm}`);
      const data = await res.json();
      setResults(data.results);
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

  return (
    <>
      {/* ✅ Set Page Title & Meta */}
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
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">
            {`Search Results for "${query}"`}
          </h1>

          {loading && <p className="text-center text-gray-600">Loading...</p>}

          {results && Object.values(results).every((arr) => arr.length === 0) && (
            <p className="text-center text-gray-500">No results found.</p>
          )}

          {/* Search Results Grid */}
          {results && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Consultancies */}
              {results.consultancies.map((consultancy) => (
                <ConsultancyCard key={consultancy.id} consultancy={consultancy} />
              ))}

              {/* Universities */}
              {results.universities.map((university) => (
                <UniversityCard key={university.id} university={university} />
              ))}

              {/* Courses */}
              {results.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
