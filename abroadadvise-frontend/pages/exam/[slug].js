"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

// Importing Exam Sections
import ExamHeader from "./ExamHeader";
import ExamConsultancies from "./ExamConsultancies";
import ExamCenter from "./ExamCenter";
import ExamAbout from "./ExamAbout";
import SimilarExams from "./SimilarExams";

// Importing Global Components
import Footer from "../../components/footer";
import Header from "../../components/header";
import InquiryModal from "../../components/InquiryModal";

// Importing custom 404 page
import Custom404 from "../404"; // ✅ Import 404 Page

const ExamDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false); // ✅ Track 404 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState({
    entityType: "exam",
    entityId: null,
    entityName: "",
  });

  useEffect(() => {
    if (!router.isReady || !slug) return;
  
    const fetchExam = async () => {
      try {
        const res = await fetch(`${API_URL}/exam/${slug.toLowerCase()}/`);
        if (!res.ok) {
          setIsNotFound(true); // ✅ Mark as 404 instead of throwing an error
          return;
        }

        const data = await res.json();
  
        console.log("✅ Full Exam Data:", data);  // ✅ Debug entire response
        console.log("✅ Similar Exams:", JSON.stringify(data.similar_exams, null, 2));  // ✅ Log exact structure
  
        setExam(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setIsNotFound(true); // ✅ Mark as 404 if API call fails
      } finally {
        setLoading(false);
      }
    };
  
    fetchExam();
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

  // ✅ Show loading while fetching
  if (loading) {
    return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;
  }

  // ✅ Redirect to 404 if exam is not found
  if (isNotFound) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>{exam.name} - Exam Details</title>
        <meta name="description" content={exam.short_description || "Exam details page"} />
      </Head>

      <Header />

      <main className="bg-gray-50 text-black min-h-screen pb-12">
        {/* Exam Header */}
        <ExamHeader exam={exam} setIsModalOpen={setIsModalOpen} setSelectedEntity={setSelectedEntity} />

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column (Sidebar) */}
          <div className="md:col-span-1 space-y-6">
            <ExamCenter exam={exam} />
            <ExamConsultancies consultancies={exam.preparation_classes} exam={exam} />
          </div>

          {/* Right Column (Main Content) */}
          <div className="md:col-span-2 space-y-6">
            <ExamAbout exam={exam} />
            <SimilarExams exams={exam?.similar_exams || []} currentSlug={exam.slug} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Inquiry Modal */}
      {isModalOpen && (
        <InquiryModal
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

export default ExamDetailPage;
