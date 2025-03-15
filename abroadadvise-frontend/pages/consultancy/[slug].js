"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

// Importing consultancy sections
import ConsultancyHeader from "./ConsultancyHeader";
import ConsultancyContact from "./ConsultancyContact";
import ConsultancyAbout from "./ConsultancyAbout";
import ConsultancyServices from "./ConsultancyServices";
import ConsultancyExams from "./ConsultancyExams";
import ConsultancyUniversities from "./ConsultancyUniversities";
import ConsultancyDestinations from "./ConsultancyDestinations";
import ConsultancyGallery from "./ConsultancyGallery";
import ConsultancyBranches from "./ConsultancyBranches";
import ConsultancyMap from "./ConsultancyMap"; // ✅ Map Component Added

// Importing Inquiry Modal
import InquiryModal from "../../components/InquiryModal"; // ✅ Dynamic Inquiry Modal

// Importing global layout components
import Footer from "../../components/footer";
import Header from "../../components/header";

// Import Next.js 404 page
import Custom404 from "../404"; // ✅ Import 404 page

const ConsultancyDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [consultancy, setConsultancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false); // ✅ Track 404 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState({
    entityType: "consultancy",
    entityId: null,
    entityName: "",
  });

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchConsultancy = async () => {
      try {
        const res = await fetch(`${API_URL}/consultancy/${slug}/`);

        if (!res.ok) {
          setIsNotFound(true); // ✅ Instead of throwing an error, mark it as 404
          return;
        }

        const data = await res.json();
        setConsultancy(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setIsNotFound(true); // ✅ If any error occurs, mark it as 404
      } finally {
        setLoading(false);
      }
    };

    fetchConsultancy();
  }, [router.isReady, slug, API_URL]);

  // ✅ Open Inquiry Modal Dynamically
  const openInquiryModal = (entityType, entityId, entityName) => {
    if (!entityType || !entityId) {
      console.error("❌ Missing entityType or entityId:", { entityType, entityId });
      alert("Something went wrong! Missing entity type or ID.");
      return;
    }

    console.log("✅ Opening Inquiry Modal for:", { entityType, entityId, entityName });

    setSelectedEntity({ entityType, entityId, entityName });
    setIsModalOpen(true);
  };

  // ✅ Show loading indicator while fetching data
  if (loading)
    return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;

  // ✅ Redirect to 404 if consultancy is not found
  if (isNotFound) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>{consultancy.name} - Consultancy</title>
        <meta name="description" content={consultancy.about || "Study abroad consultancy details"} />
      </Head>

      <Header />

      <main className="bg-gray-50 text-black min-h-screen pb-12">
        {/* Consultancy Header - Fixed Props */}
        <ConsultancyHeader
          consultancy={consultancy}
          setIsModalOpen={setIsModalOpen}
          setSelectedEntity={setSelectedEntity} // ✅ Fixed
        />

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <ConsultancyContact consultancy={consultancy} />
            <ConsultancyMap google_map_url={consultancy.google_map_url} consultancyName={consultancy.name} />
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Destinations Section with Apply Now Buttons */}
            <ConsultancyDestinations
              destinations={consultancy.study_abroad_destinations}
              openInquiryModal={openInquiryModal}
            />

            {/* Exams Section with Apply Now Buttons */}
            <ConsultancyExams
              exams={consultancy.test_preparation}
              openInquiryModal={openInquiryModal}
            />

            {/* Branches */}
            <ConsultancyBranches branches={consultancy.branches} />
            <ConsultancyGallery gallery={consultancy.gallery_images} />

            {/* Universities Section with Apply Now Buttons */}
            <ConsultancyUniversities
              universities={consultancy.partner_universities}
              openInquiryModal={openInquiryModal}
            />

            {/* About Section */}
            <ConsultancyAbout consultancy={consultancy} />
            <ConsultancyServices consultancy={consultancy} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Dynamic Inquiry Modal */}
      {isModalOpen && (
        <InquiryModal
          consultancyId={consultancy?.id ?? null}
          consultancyName={consultancy?.name ?? ""}
          entityType={selectedEntity.entityType}
          entityId={selectedEntity.entityId}
          entityName={selectedEntity.entityName}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
};

export default ConsultancyDetailPage;
