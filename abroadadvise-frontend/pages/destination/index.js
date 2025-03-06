import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";  
import Footer from "@/components/footer";  

const DestinationList = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/`);
                const data = await res.json();
                setDestinations(data.results || []); // ✅ Ensure it's an array
            } catch (err) {
                console.error("Error fetching destinations:", err);
                setError("Failed to load destinations.");
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    return (
        <>
            <Header />

            <main className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Study Destinations</h1>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {destinations.map((destination) => (
                        <Link key={destination.slug} href={`/destination/${destination.slug}`} passHref>
                            <div className="border rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition">
                                {destination.country_logo && (
                                    <img 
                                        src={destination.country_logo}  
                                        alt={destination.title} 
                                        className="w-24 h-24 mx-auto rounded-full"
                                    />
                                )}
                                <h2 className="text-xl font-semibold mt-2 text-center">{destination.title}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </>
    );
};

export default DestinationList;
