import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";

const DestinationPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    if (!slug) return console.error("Slug is undefined!");

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/destination/${slug}/`;
    console.log("Fetching from:", apiUrl);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data); // ✅ Debugging log
        setDestination(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load destination details.");
        setLoading(false);
      });
  }, [router.isReady, slug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!destination) return <p>Destination not found.</p>;

  // ✅ Ensure images have full URLs
  const coverImage = destination.cover_page ? `${process.env.NEXT_PUBLIC_API_URL}${destination.cover_page}` : "/media/default-cover.jpg";
  const logoImage = destination.country_logo ? `${process.env.NEXT_PUBLIC_API_URL}${destination.country_logo}` : "/media/default-logo.png";

  return (
    <>
      <Head>
        <title>{destination.title} - Study Destination</title>
        <meta name="description" content={destination.why_choose || `Study in ${destination.title}. Learn about requirements, scholarships, and more.`} />
      </Head>

      <Header />

      <main className="max-w-4xl mx-auto p-6 bg-white text-black shadow-lg rounded-md">
        {/* ✅ Cover Photo */}
        {destination.cover_page && (
          <img src={coverImage} alt="Cover" className="w-full h-60 object-cover rounded-md mb-4" />
        )}

        {/* ✅ Country Logo */}
        {destination.country_logo && (
          <img src={logoImage} alt="Country Logo" className="w-36 h-36 object-contain border rounded-md shadow mx-auto" />
        )}

        {/* Destination Title */}
        <h1 className="text-2xl font-bold text-center mt-4">{destination.title}</h1>

        {/* ✅ Why Choose Section */}
        {destination.why_choose && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Why Choose {destination.title}?</h2>
            <div dangerouslySetInnerHTML={{ __html: destination.why_choose }} className="prose max-w-none" />
          </div>
        )}

        {/* ✅ Requirements Section */}
        {destination.requirements && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
            <div dangerouslySetInnerHTML={{ __html: destination.requirements }} className="prose max-w-none" />
          </div>
        )}

        {/* ✅ Documents Required Section */}
        {destination.documents_required && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Documents Required</h2>
            <div dangerouslySetInnerHTML={{ __html: destination.documents_required }} className="prose max-w-none" />
          </div>
        )}

        {/* ✅ Scholarships Section */}
        {destination.scholarships && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Scholarships</h2>
            <div dangerouslySetInnerHTML={{ __html: destination.scholarships }} className="prose max-w-none" />
          </div>
        )}

        {/* ✅ More Information */}
        {destination.more_information && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">More Information</h2>
            <div dangerouslySetInnerHTML={{ __html: destination.more_information }} className="prose max-w-none" />
          </div>
        )}

        {/* ✅ FAQs */}
        {destination.faqs && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">FAQs</h2>
            <div dangerouslySetInnerHTML={{ __html: destination.faqs }} className="prose max-w-none" />
          </div>
        )}

        {/* ✅ Other Destinations */}
        {destination.other_destinations && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Other Destinations</h2>
            <div dangerouslySetInnerHTML={{ __html: destination.other_destinations }} className="prose max-w-none" />
          </div>
        )}

        {/* ✅ Courses to Study */}
        {destination.courses_to_study && destination.courses_to_study.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Courses Available</h2>
            <ul className="list-disc pl-5">
              {destination.courses_to_study.map((course) => (
                <li key={course.id}>{course.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-6">No courses available.</p>
        )}

        {/* ✅ Universities */}
        {destination.universities && destination.universities.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Universities</h2>
            <ul className="list-disc pl-5">
              {destination.universities.map((uni) => (
                <li key={uni.id}>{uni.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-6">No universities found.</p>
        )}

        {/* ✅ Consultancies */}
        {destination.consultancies && destination.consultancies.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Consultancies</h2>
            <ul className="list-disc pl-5">
              {destination.consultancies.map((consultancy) => (
                <li key={consultancy.id}>{consultancy.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-6">No consultancies available.</p>
        )}
      </main>

      <Footer />
    </>
  );
};

export default DestinationPage;
