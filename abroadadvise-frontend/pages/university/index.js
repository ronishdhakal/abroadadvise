import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

const UniversityList = () => {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // ✅ Fetch universities with error handling
    const fetchUniversities = async (page = 1) => {
        setLoading(true);
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/university/?page=${page}`;
            console.log("Fetching from API:", apiUrl);

            const res = await fetch(apiUrl);

            // ✅ Check if response is valid JSON
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Received non-JSON response from API");
            }

            const data = await res.json();
            setUniversities(data.results || []);
            setTotalPages(Math.ceil(data.count / 10)); // Adjust for pagination size
        } catch (error) {
            console.error("Error fetching universities:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUniversities(currentPage).catch((err) => {
            console.error("API Fetch Failed:", err);
        });
    }, [currentPage]);

    return (
        <div>
            <Header /> {/* Include Header */}
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Universities</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {universities.map((university) => (
                            <div key={university.slug} className="border p-4 rounded-lg shadow-md bg-white">
                                {/* ✅ FIXED: Ensure valid logo path */}
                                {university.logo && (
                                    <img 
                                        src={university.logo}  
                                        alt={university.name} 
                                        className="h-20 w-20 mb-2 object-cover"
                                        onError={(e) => e.target.style.display = 'none'} // ✅ Hide broken images
                                    />
                                )}
                                <h2 className="text-xl font-semibold">{university.name}</h2>
                                <p className="text-gray-600">{university.country}</p>
                                <Link href={`/university/${university.slug}`} className="text-blue-600 font-medium">
                                    View Details →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
            <Footer /> {/* Include Footer */}
        </div>
    );
};

export default UniversityList;
