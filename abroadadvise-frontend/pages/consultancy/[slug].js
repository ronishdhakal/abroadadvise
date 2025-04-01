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
import ConsultancyMap from "./ConsultancyMap";
import ConsultancyEvent from "./ConsultancyEvent";

// Inquiry Modal
import InquiryModal from "../../components/InquiryModal";

// Global layout
import Footer from "../../components/footer";
import Header from "../../components/header";
import Custom404 from "../404";

const ConsultancyDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [consultancy, setConsultancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
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
          setIsNotFound(true);
          return;
        }
        const data = await res.json();
        setConsultancy(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultancy();
  }, [router.isReady, slug, API_URL]);

  const openInquiryModal = (entityType, entityId, entityName, consultancyId, consultancyName) => {
    if (!entityType || !entityId) {
      alert("Something went wrong! Missing entity type or ID.");
      return;
    }

    setSelectedEntity({ entityType, entityId, entityName, consultancyId, consultancyName });
    setIsModalOpen(true);
  };

  if (loading) return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;
  if (isNotFound) return <Custom404 />;

  return (
    <>
      <Head>
        <title>{consultancy.name} - Consultancy</title>
        <meta name="description" content={consultancy.about || "Study abroad consultancy details"} />
      </Head>

      <Header />

      <main className="bg-gray-50 text-black min-h-screen pb-12">
        <ConsultancyHeader
          consultancy={consultancy}
          setIsModalOpen={setIsModalOpen}
          setSelectedEntity={setSelectedEntity}
        />

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <ConsultancyContact consultancy={consultancy} />
            <ConsultancyMap google_map_url={consultancy.google_map_url} consultancyName={consultancy.name} />

            {/* 🔥 Sticky Events on Desktop */}
            <div className="hidden md:block sticky top-28 h-fit">
              <ConsultancyEvent slug={consultancy.slug} />
            </div>

            {/* 📱 Fallback for mobile */}
            <div className="md:hidden">
              <ConsultancyEvent slug={consultancy.slug} />
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <ConsultancyDestinations
              destinations={consultancy.study_abroad_destinations}
              openInquiryModal={openInquiryModal}
              consultancyId={consultancy.id}
              consultancyName={consultancy.name}
              verified={consultancy.verified}
            />

            <ConsultancyExams
              exams={consultancy.test_preparation}
              openInquiryModal={openInquiryModal}
              consultancyId={consultancy.id}
              consultancyName={consultancy.name}
              verified={consultancy.verified}
            />

            <ConsultancyBranches branches={consultancy.branches} />
            <ConsultancyGallery gallery={consultancy.gallery_images} />

            <ConsultancyUniversities
              universities={consultancy.partner_universities}
              openInquiryModal={openInquiryModal}
              consultancyId={consultancy.id}
              consultancyName={consultancy.name}
              verified={consultancy.verified}
            />

            <ConsultancyAbout consultancy={consultancy} />
            <ConsultancyServices consultancy={consultancy} />
          </div>
        </div>
      </main>

      <Footer />

      {isModalOpen && (
        <InquiryModal
          consultancyId={selectedEntity?.consultancyId ?? null}
          consultancyName={selectedEntity?.consultancyName ?? ""}
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
