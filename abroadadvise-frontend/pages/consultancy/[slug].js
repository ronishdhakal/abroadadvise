import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";

const ConsultancyPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [consultancy, setConsultancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    if (!slug) return console.error("Slug is undefined!");

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/consultancy/${slug}/`;
    console.log("Fetching from:", apiUrl);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setConsultancy(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load consultancy details.");
        setLoading(false);
      });
  }, [router.isReady, slug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!consultancy) return <p>Consultancy not found.</p>;

  return (
    <>
      <Head>
        <title>{consultancy.name} - Consultancy</title>
        <meta name="description" content={consultancy.about || "Study abroad consultancy details"} />
      </Head>

      <Header />

      <main className="max-w-4xl mx-auto p-6 bg-white text-black shadow-lg rounded-md">
        {/* Cover Photo */}
        {consultancy.cover_photo && (
          <img src={consultancy.cover_photo} alt="Cover" className="w-full h-60 object-cover rounded-md mb-4" />
        )}

        {/* Consultancy Details */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo */}
          {consultancy.logo && (
            <img src={consultancy.logo} alt="Logo" className="w-36 h-36 object-contain border rounded-md shadow" />
          )}

          {/* Main Info */}
          <div>
            <h1 className="text-2xl font-bold">{consultancy.name}</h1>
            <p><strong>Address:</strong> {consultancy.address || "Not Available"}</p>
            <p><strong>Website:</strong> {consultancy.website ? <a href={consultancy.website} target="_blank" className="text-blue-500 underline">{consultancy.website}</a> : "Not Available"}</p>
            <p><strong>Email:</strong> {consultancy.email || "Not Available"}</p>
            <p><strong>Phone:</strong> {consultancy.phone || "Not Available"}</p>
            <p><strong>MOE Certified:</strong> {consultancy.moe_certified ? "✅ Yes" : "❌ No"}</p>
            <p><strong>Establishment Date:</strong> {consultancy.establishment_date || "Not Available"}</p>
            {consultancy.latitude && consultancy.longitude && (
              <p><strong>Location:</strong> 📍 {consultancy.latitude}, {consultancy.longitude}</p>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <div dangerouslySetInnerHTML={{ __html: consultancy.about || "<p>No description available.</p>" }} className="prose max-w-none" />
        </div>

        {/* Brochure Download */}
        {consultancy.brochure && (
          <div className="mt-6">
            <a href={consultancy.brochure} target="_blank" className="px-4 py-2 bg-blue-600 text-white rounded-md">
              📄 Download Brochure
            </a>
          </div>
        )}

        {/* Study Abroad Destinations */}
        {consultancy.study_abroad_destinations.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Study Abroad Destinations</h2>
            <ul className="list-disc pl-5">
              {consultancy.study_abroad_destinations.map((dest) => (
                <li key={dest.id}>{dest.title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Test Preparation */}
        {consultancy.test_preparation.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Test Preparation</h2>
            <ul className="list-disc pl-5">
              {consultancy.test_preparation.map((exam) => (
                <li key={exam.id}>{exam.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Partner Universities */}
        {consultancy.partner_universities.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Partner Universities</h2>
            <ul className="list-disc pl-5">
              {consultancy.partner_universities.map((uni) => (
                <li key={uni.id}>{uni.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Branches (JSON Field) */}
        {consultancy.branches && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Branches</h2>
            <pre className="bg-gray-100 p-3 rounded-md">{JSON.stringify(consultancy.branches, null, 2)}</pre>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default ConsultancyPage;
