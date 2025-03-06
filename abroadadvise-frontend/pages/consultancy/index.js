import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/footer";

const ConsultancyList = () => {
  const [consultancies, setConsultancies] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [destination, setDestination] = useState("");
  const [exam, setExam] = useState("");
  const [moeCertified, setMoeCertified] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Fetch exams from the backend
  useEffect(() => {
    const fetchExams = async () => {
      try {
        let query = `${process.env.NEXT_PUBLIC_API_URL}/exam/all/`; // ✅ Ensure this matches backend

        console.log("Fetching exams from:", query);

        const response = await fetch(query);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched exams:", data); // ✅ Debug response
        setExams(data || []);
      } catch (err) {
        console.error("Error fetching exams:", err);
      }
    };
    fetchExams();
  }, []);

  // ✅ Fetch consultancies with filters
  useEffect(() => {
    const fetchConsultancies = async () => {
      setLoading(true);
      try {
        let query = `${process.env.NEXT_PUBLIC_API_URL}/consultancy/?page=${currentPage}`;

        if (search) query += `&search=${search}`;
        if (district) query += `&district=${district}`;
        if (destination) query += `&destination=${destination}`;
        if (exam) query += `&exam=${exam}`; // ✅ Ensure correct filtering field
        if (moeCertified !== "") query += `&moe_certified=${moeCertified}`;

        console.log("Fetching consultancies from:", query);

        const response = await fetch(query);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched consultancies:", data); // ✅ Debug response
        setConsultancies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Error fetching consultancies:", err);
        setError("Failed to load consultancies.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultancies();
  }, [search, district, destination, exam, moeCertified, currentPage]);

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
          Explore Top Consultancies
        </h1>

        {/* 🔍 Search and Filters */}
        <div className="bg-gray-100 p-6 shadow-md rounded-xl mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="🔍 Search consultancies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* District Filter */}
            <input
              type="text"
              placeholder="🏢 Filter by district..."
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Destination Filter */}
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border p-3 w-full rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">🌍 All Destinations</option>
              <option value="Australia">🇦🇺 Australia</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="USA">🇺🇸 USA</option>
              <option value="UK">🇬🇧 UK</option>
            </select>

            {/* Exam Filter (Dynamic) */}
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="border p-3 w-full rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">📝 All Exams</option>
              {exams.length > 0 ? (
                exams.map((examItem) => (
                  <option key={examItem.id} value={examItem.slug}>
                    {examItem.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading exams...</option>
              )}
            </select>

            {/* MOE Certification Filter */}
            <select
              value={moeCertified}
              onChange={(e) => setMoeCertified(e.target.value)}
              className="border p-3 w-full rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">🏆 MOE Certified?</option>
              <option value="true">✅ Yes</option>
              <option value="false">❌ No</option>
            </select>
          </div>
        </div>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* 📌 Consultancy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {consultancies.map((consultancy) => (
            <Link key={consultancy.slug} href={`/consultancy/${consultancy.slug}`} passHref>
              <div className="border rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition duration-300 bg-white hover:bg-gray-100">
                {consultancy.logo && (
                  <img 
                    src={consultancy.logo} 
                    alt={consultancy.name} 
                    className="w-36 h-36 mx-auto rounded-lg"
                  />
                )}
                <h2 className="text-xl font-semibold mt-3 text-center">{consultancy.name}</h2>
                <p className="text-gray-600 text-center">{consultancy.address}</p>
                {consultancy.moe_certified && <p className="text-green-500 text-center">✅ MOE Certified</p>}
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg transition hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg transition hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ConsultancyList;
