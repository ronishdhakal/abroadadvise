// Ensure default exports for components
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "./HeroSection";
import UniversityFilters from "./UniversityFilters";
import UniversityCard from "./UniversityCard";
import Pagination from "./Pagination";

const UniversityList = () => {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");

    const fetchUniversities = async (page = 1, search = "", country = "") => {
        setLoading(true);
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/university/?page=${page}&search=${search}&country=${country}`;
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error("Failed to fetch universities");
            const data = await res.json();
            setUniversities(data.results || []);
            setTotalPages(Math.ceil(data.count / 10));
        } catch (error) {
            console.error("Error fetching universities:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUniversities(currentPage, searchQuery, selectedCountry);
    }, [currentPage, searchQuery, selectedCountry]);

    return (
        <div className="bg-white min-h-screen">
            <Header />
            {HeroSection && <HeroSection title="Explore Universities" subtitle="Find the best universities for your studies abroad" />}
            
            {UniversityFilters && (
                <UniversityFilters 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                    selectedCountry={selectedCountry} 
                    setSelectedCountry={setSelectedCountry} 
                />
            )}
            
            <div className="container mx-auto px-4 py-6">
                {loading ? (
                    <p className="text-center text-lg">Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {universities.length > 0 ? (
                            universities.map((university) => (
                                UniversityCard ? <UniversityCard key={university.slug} university={university} /> : null
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No universities found.</p>
                        )}
                    </div>
                )}
            </div>
            
            {Pagination && <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />}
            <Footer />
        </div>
    );
};

export default UniversityList;
