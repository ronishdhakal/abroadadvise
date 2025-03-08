"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/header"; // ✅ Kept absolute import
import Footer from "@/components/footer"; // ✅ Kept absolute import
import InquiryModal from "@/components/InquiryModal"; // ✅ Kept absolute import
import DestinationHeader from "../destination/DestinationHeader"; // ✅ Fixed relative import
import DestinationOverview from "../destination/DestinationOverview"; 
import DestinationConsultancies from "../destination/DestinationConsultancies";
import DestinationUniversities from "../destination/DestinationUniversities";
import DestinationCourses from "../destination/DestinationCourses";
import DestinationWhyChoose from "../destination/DestinationWhyChoose";
import DestinationRequirements from "../destination/DestinationRequirements";
import DestinationDocumentsRequired from "../destination/DestinationDocumentsRequired";
import DestinationScholarships from "../destination/DestinationScholarships";
import DestinationMoreInformation from "../destination/DestinationMoreInformation";
import DestinationOtherDestinations from "../destination/DestinationOtherDestinations";

const DestinationDetail = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [destination, setDestination] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [consultancies, setConsultancies] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Inquiry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching destination details...");

        // Fetch destination details
        const destRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/${slug}/`);
        if (!destRes.ok) throw new Error(`Failed to fetch destination: ${destRes.status}`);
        const destData = await destRes.json();
        console.log("✅ Destination Data:", destData);
        setDestination(destData);

        // Fetch universities linked to this destination
        const uniRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/university/?country=${destData.title}`);
        const uniData = await uniRes.json();
        console.log("✅ Filtered Universities:", uniData.results);
        setUniversities(uniData.results || []);

        // Fetch courses **directly linked** to this destination
        const courseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/?destination=${destData.id}`);
        const courseData = await courseRes.json();
        console.log("✅ Filtered Courses:", courseData.results);
        setCourses(courseData.results || []);

        // Fetch consultancies linked to this destination
        const consRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultancy/`);
        const consData = await consRes.json();
        const filteredConsultancies = consData.results.filter(cons =>
          Array.isArray(cons.study_abroad_destinations) &&
          cons.study_abroad_destinations.some(dest => dest.id === destData.id)
        );
        console.log("✅ Filtered Consultancies:", filteredConsultancies);
        setConsultancies(filteredConsultancies);

        // Fetch all destinations
        const allDestRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/`);
        const allDestData = await allDestRes.json();
        console.log("✅ Other Destinations:", allDestData.results);
        setDestinations(allDestData.results || []);

      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Failed to load destination details.");
      } finally {
        setLoading(false);
        console.log("✅ Data fetching complete.");
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <p className="text-center text-gray-600 mt-4">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!destination) return <p className="text-gray-500 text-center mt-4">Destination not found.</p>;

  return (
    <>
      <Head>
        <title>Study in {destination.title} from Nepal - Abroad Advise</title>
        <meta
          name="description"
          content={`Explore studying in ${destination.title}. Learn about universities, courses, scholarships, and requirements.`}
        />
      </Head>

      <Header />
      
      {/* ✅ Full-Width Destination Header */}
      <div className="w-full p-0 m-0">
        <DestinationHeader
          destination={destination}
          setIsModalOpen={setIsModalOpen}
          setSelectedEntity={setSelectedEntity}
        />
      </div>

      {/* ✅ Content Sections (Matching University Page) */}
      <div className="container mx-auto p-4 space-y-6 md:px-10 lg:px-16 py-0 xl:px-24">
        {/* Destination Overview */}
        <div className="w-full">
          <DestinationOverview
            destination={destination}
            universities={universities}
            courses={courses}
            consultancies={consultancies}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar - Increased Size */}
          <aside className="space-y-6 md:col-span-1">
            <DestinationConsultancies destination={destination} consultancies={consultancies} />
            <DestinationUniversities destination={destination} universities={universities} />
          </aside>

          {/* Right Section - Main Content */}
          <section className="md:col-span-2 space-y-6">
            {/* Courses to Apply */}
            <DestinationCourses destination={destination} courses={courses} />

            {/* Why Choose Section */}
            {destination.why_choose && <DestinationWhyChoose destination={destination} />}

            {/* Scholarships Section */}
            {destination.scholarships && <DestinationScholarships destination={destination} />}

            {/* Requirements Section */}
            {destination.requirements && <DestinationRequirements destination={destination} />}

            {/* Documents Required Section */}
            {destination.documents_required && <DestinationDocumentsRequired destination={destination} />}

            {/* More Information Section */}
            {destination.more_information && <DestinationMoreInformation destination={destination} />}

            {/* Explore Other Study Destinations Section */}
            <DestinationOtherDestinations destinations={destinations} currentSlug={destination.slug} />
          </section>
        </div>
      </div>

      <Footer />

      {/* Inquiry Modal */}
      {selectedEntity && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType={selectedEntity.entityType}
          entityId={selectedEntity.entityId}
          entityName={selectedEntity.entityName}
          additionalData={{
            destinationId: destination.id, // ✅ Sending Destination Data
            destinationName: destination.title,
          }}
        />
      )}
    </>
  );
};

export default DestinationDetail;
