import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import HeroSection from "./HeroSection";
import ConsultancyFilters from "./ConsultancyFilters";
import ConsultancyCard from "./ConsultancyCard";
import Pagination from "./Pagination";
import { Search, Filter } from "lucide-react";

const ConsultancyList = () => {
  const [consultancies, setConsultancies] = useState([]);
  const [exams, setExams] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [destination, setDestination] = useState("");
  const [exam, setExam] = useState("");
  const [moeCertified, setMoeCertified] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ Fetch exams
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/exam/all/`)
      .then((res) => res.json())
      .then(setExams);
  }, []);

  // ✅ Fetch destinations
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/all/`)
      .then((res) => res.json())
      .then(setDestinations);
  }, []);

  // ✅ Fetch consultancies with applied filters
  useEffect(() => {
    const fetchConsultancies = async () => {
      let query = `${process.env.NEXT_PUBLIC_API_URL}/consultancy/?page=${currentPage}`;
  
      if (search) query += `&name=${search}`;
      if (district) query += `&district=${district}`;
      if (destination) query += `&destination=${destination}`;
      if (exam) query += `&exam=${exam}`;
      if (moeCertified !== "") query += `&moe_certified=${moeCertified}`;
  
      try {
        const response = await fetch(query);
        const data = await response.json();
        
        console.log("API Response:", data); // ✅ Debugging API response
  
        setConsultancies(data.results || []);
        setTotalPages(data.total_pages || 1); // ✅ Ensuring `totalPages` is properly set
      } catch (error) {
        console.error("Error fetching consultancies:", error);
      }
    };
  
    fetchConsultancies();
  }, [search, district, destination, exam, moeCertified, currentPage]);
  
  return (
    <>
      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 🔍 Search & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          {/* 🔍 Search Bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search consultancies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            <Filter className="h-5 w-5 mr-2" />
            {isFilterOpen ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {/* 📌 Show Filters Only When Clicked */}
        {isFilterOpen && (
          <ConsultancyFilters
            search={search}
            setSearch={setSearch}
            district={district}
            setDistrict={setDistrict}
            destination={destination}
            setDestination={setDestination}
            exam={exam}
            setExam={setExam}
            moeCertified={moeCertified}
            setMoeCertified={setMoeCertified}
            exams={exams}
            destinations={destinations}
          />
        )}

        {/* Consultancy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {consultancies.length > 0 ? (
            consultancies.map((consultancy) => (
              <ConsultancyCard key={consultancy.slug} consultancy={consultancy} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No consultancies found.</p>
          )}
        </div>

        {/* Pagination (Fully Working) */}
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

export default ConsultancyList;
