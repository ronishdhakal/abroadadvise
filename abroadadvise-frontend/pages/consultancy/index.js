import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";

// Components
import Head from "next/head";
import SeoHead from "../../components/SeoHead";
import Header from "../../components/header";
import Footer from "../../components/footer";
import HeroSection from "./HeroSection";
import ConsultancyFilters from "./ConsultancyFilters";
import ConsultancyCard from "./ConsultancyCard";
import Pagination from "./Pagination";

const ConsultancyList = ({ initialConsultancies, initialTotalPages, districts, exams, destinations }) => {
  const [consultancies, setConsultancies] = useState(initialConsultancies);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [search, setSearch] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [destination, setDestination] = useState("");
  const [exam, setExam] = useState("");
  const [moeCertified, setMoeCertified] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchConsultancies = async () => {
    try {
      const queryParams = new URLSearchParams({ page: currentPage });

      if (search) queryParams.append("name", search);
      if (selectedDistricts.length > 0) {
        selectedDistricts.forEach((district) => {
          queryParams.append("districts", district.value);
        });
      }
      if (destination) queryParams.append("destination", destination);
      if (exam) queryParams.append("exam", exam);
      if (moeCertified !== "") queryParams.append("moe_certified", moeCertified);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultancy/?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`Failed to fetch consultancies: ${response.status}`);

      const data = await response.json();
      setConsultancies(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error("Error fetching consultancies:", error.message);
    }
  };

  useEffect(() => {
    fetchConsultancies();
  }, [search, selectedDistricts, destination, exam, moeCertified, currentPage]);

  return (
    <>
      <SeoHead
        title="Best Consultancies in Nepal to Study Abroad - Abroad Advise"
        description="Explore top study abroad education consultancies for Nepalese students and plan your international education journey."
        keywords="study abroad, consultancy, Nepal, education consultancy, best consultancy in Nepal"
        url="https://abroadadvise.com/consultancy"
        image="https://abroadadvise.com/logo/default-logo.png" // ✅ Corrected path
      />

      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search consultancies..."
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

        {isFilterOpen && (
          <ConsultancyFilters
            search={search}
            setSearch={setSearch}
            selectedDistricts={selectedDistricts}
            setSelectedDistricts={setSelectedDistricts}
            destination={destination}
            setDestination={setDestination}
            exam={exam}
            setExam={setExam}
            moeCertified={moeCertified}
            setMoeCertified={setMoeCertified}
            exams={exams}
            districts={districts}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {consultancies.length > 0 ? (
            consultancies.map((consultancy) => (
              <ConsultancyCard key={consultancy.slug} consultancy={consultancy} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No consultancies found.</p>
          )}
        </div>

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
    const [consultancyRes, districtRes, examRes, destinationRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultancy/?page=1`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/districts/`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/exam/`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/`)
    ]);

    if (!consultancyRes.ok || !districtRes.ok || !examRes.ok || !destinationRes.ok) {
      throw new Error("API failed");
    }

    const [consultancyData, districtData, examData, destinationData] = await Promise.all([
      consultancyRes.json(),
      districtRes.json(),
      examRes.json(),
      destinationRes.json()
    ]);

    return {
      props: {
        initialConsultancies: consultancyData.results || [],
        initialTotalPages: Math.ceil(consultancyData.count / 10) || 1,
        districts: districtData.results || [],
        exams: examData.results || [],
        destinations: destinationData.results || [],
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return {
      props: {
        initialConsultancies: [],
        initialTotalPages: 1,
        districts: [],
        exams: [],
        destinations: [],
      },
    };
  }
}

export default ConsultancyList;
