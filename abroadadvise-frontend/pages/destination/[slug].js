"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/header"; // ✅ Absolute import
import Footer from "@/components/footer"; // ✅ Absolute import
import InquiryModal from "@/components/InquiryModal"; // ✅ Absolute import

// Importing destination components
import DestinationHeader from "../destination/DestinationHeader";
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

// Importing custom 404 page
import Custom404 from "../404"; // ✅ Import 404 Page

const DestinationDetail = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [destination, setDestination] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [consultancies, setConsultancies] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false); // ✅ Track 404 state

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
        if (!destRes.ok) {
          setIsNotFound(true); // ✅ Mark as 404 instead of throwing an error
          return;
        }

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
        setIsNotFound(true); // ✅ Mark as 404 on error
      } finally {
        setLoading(false);
        console.log("✅ Data fetching complete.");
      }
    };

    fetchData();
  }, [slug]);

  // ✅ Show loading while fetching
  if (loading) return <p className="text-center text-gray-600 mt-4">Loading...</p>;

  // ✅ Redirect to 404 if destination is not found
  if (isNotFound) {
    return <Custom404 />;
  }

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
