"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

// ✅ Import college-specific sections
import CollegeHeader from "./CollegeHeader";
import CollegeContact from "./CollegeContact";
import CollegeAbout from "./CollegeAbout";
import CollegeServices from "./CollegeServices";
import CollegeGallery from "./CollegeGallery";
import CollegeBranches from "./CollegeBranches";
import CollegeCourses from "./CollegeCourses"; // ✅ NEW

// ✅ Inquiry modal & layout
import InquiryModal from "../../components/InquiryModal";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Custom404 from "../404";

const CollegeDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [college, setCollege] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState({
    entityType: "college",
    entityId: null,
    entityName: "",
  });

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchCollegeData = async () => {
      try {
        const [collegeRes, coursesRes] = await Promise.all([
          fetch(`${API_URL}/college/${slug}/`),
          fetch(`${API_URL}/course/`),
        ]);

        if (!collegeRes.ok) {
          setIsNotFound(true);
          return;
        }

        const collegeData = await collegeRes.json();
        const courseData = await coursesRes.json();

        setCollege(collegeData);
        setAllCourses(courseData.results || []);
      } catch (err) {
        console.error("Error fetching college or courses:", err);
        setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [router.isReady, slug, API_URL]);

  const openInquiryModal = (entityType, entityId, entityName) => {
    if (!entityType || !entityId) {
      alert("Missing entity info.");
      return;
    }

    setSelectedEntity({
      entityType,
      entityId,
      entityName,
      collegeId: college?.id,
      collegeName: college?.name,
    });
    setIsModalOpen(true);
  };

  if (loading)
    return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;

  if (isNotFound) return <Custom404 />;

  return (
    <>
      <Head>
        <title>{college.name} - College</title>
        <meta name="description" content={college.about || "Study abroad college details"} />
      </Head>

      <Header />

      <main className="bg-gray-50 text-black min-h-screen pb-12">
        <CollegeHeader
          college={college}
          setIsModalOpen={setIsModalOpen}
          setSelectedEntity={setSelectedEntity}
        />

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <CollegeContact college={college} />
            {/* Optional: Add map if available */}
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* ✅ NEW: Show college-related courses */}
            <CollegeCourses college={college} courses={allCourses} />

            <CollegeBranches branches={college.branches} />
            <CollegeGallery gallery={college.gallery_images} />
            <CollegeAbout college={college} />
            <CollegeServices college={college} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Inquiry Modal */}
      {isModalOpen && (
        <InquiryModal
          consultancyId={selectedEntity?.collegeId ?? null}
          consultancyName={selectedEntity?.collegeName ?? ""}
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

export default CollegeDetailPage;
