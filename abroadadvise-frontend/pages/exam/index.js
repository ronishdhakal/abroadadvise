import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import HeroSection from "./HeroSection"; // ✅ Using existing Hero Section
import ExamFilters from "./ExamFilters"; // ✅ Using existing Exam Filters
import ExamCard from "./ExamCard"; // ✅ Using existing Exam Card
import ExamPagination from "./Pagination"; // ✅ Using existing Exam Pagination
import { Search, Filter } from "lucide-react";

const ExamList = ({ initialExams, initialTotalPages }) => {
  const [exams, setExams] = useState(initialExams);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ Fetch exams based on filters
  const fetchExams = async () => {
    try {
      const queryParams = new URLSearchParams({ page: currentPage });

      if (search) queryParams.append("name", search);
      if (type) queryParams.append("type", type);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exam/?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`Failed to fetch exams: ${response.status}`);

      const data = await response.json();
      setExams(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching exams:", error.message);
    }
  };

  // ✅ Fetch exams on filter change
  useEffect(() => {
    fetchExams();
  }, [search, type, currentPage]);

  return (
    <>
      {/* ✅ Set Page Title & Meta Description */}
      <Head>
        <title>Standardized & English Proficiency Exams - Abroad Advise</title>
        <meta name="description" content="Find and prepare for the best English proficiency and standardized exams for studying abroad." />
      </Head>

      <Header />
      <HeroSection /> {/* ✅ Display Hero Section for Exams */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Field */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search exams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          <ExamPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </main>

      <Footer />
    </>
  );
};

// ✅ Server-side Data Fetching (SSR)
export async function getServerSideProps() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exam/?page=1`);
    if (!response.ok) throw new Error(`Exam API failed: ${response.status}`);

    const data = await response.json();

    return {
      props: {
        initialExams: data.results || [],
        initialTotalPages: data.total_pages || 1,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return { props: { initialExams: [], initialTotalPages: 1 } };
  }
}

export default ExamList;
