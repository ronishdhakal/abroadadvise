"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

// Importing consultancy sections from pages/consultancy
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

// Importing Inquiry from components
import ConsultancyInquiry from "../../components/ConsultancyInquiry";

// Importing global layout components
import Footer from "../../components/footer";
import Header from "../../components/header";

const ConsultancyDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [consultancy, setConsultancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchConsultancy = async () => {
      try {
        const res = await fetch(`${API_URL}/consultancy/${slug}/`);
        if (!res.ok) throw new Error("Failed to fetch consultancy details.");
        const data = await res.json();
        setConsultancy(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load consultancy details.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultancy();
  }, [router.isReady, slug, API_URL]);

  if (loading)
    return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600 font-semibold mt-10">{error}</p>;
  if (!consultancy)
    return <p className="text-center text-gray-600 font-semibold mt-10">Consultancy not found.</p>;

  return (
    <>
      <Head>
        <title>{consultancy.name} - Consultancy</title>
        <meta name="description" content={consultancy.about || "Study abroad consultancy details"} />
      </Head>

      <Header />

      <main className="bg-gray-50 text-black min-h-screen pb-12">
        {/* Consultancy Header */}
        <ConsultancyHeader consultancy={consultancy} setIsModalOpen={setIsModalOpen} />

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <ConsultancyContact consultancy={consultancy} />
            <ConsultancyMap google_map_url={consultancy.google_map_url} consultancyName={consultancy.name} /> {/* ✅ Map Included */}
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <ConsultancyAbout consultancy={consultancy} />
            <ConsultancyServices consultancy={consultancy} />
            <ConsultancyUniversities universities={consultancy.partner_universities} />
            <ConsultancyDestinations destinations={consultancy.study_abroad_destinations} />
            <ConsultancyExams exams={consultancy.test_preparation} />
            <ConsultancyBranches branches={consultancy.branches} />
            <ConsultancyGallery gallery={consultancy.gallery_images} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Inquiry Modal */}
      <ConsultancyInquiry
        consultancyId={consultancy.id}
        consultancyName={consultancy.name}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default ConsultancyDetailPage;
