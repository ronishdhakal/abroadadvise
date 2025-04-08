import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";

// Components
import SeoHead from "../../components/SeoHead";
import Header from "../../components/header";
import Footer from "../../components/footer";
import InquiryModal from "../../components/InquiryModal";

// Import all essential components
import ConsultancyHeader from "./ConsultancyHeader";
import ConsultancyContact from "./ConsultancyContact";
import ConsultancyAbout from "./ConsultancyAbout";
import ConsultancyServices from "./ConsultancyServices";
import ConsultancyExams from "./ConsultancyExams";
import ConsultancyUniversities from "./ConsultancyUniversities";
import ConsultancyDestinations from "./ConsultancyDestinations";

// Lazy-loaded heavy components
const ConsultancyGallery = dynamic(() => import("./ConsultancyGallery"));
const ConsultancyBranches = dynamic(() => import("./ConsultancyBranches"));
const ConsultancyMap = dynamic(() => import("./ConsultancyMap"));
const ConsultancyEvent = dynamic(() => import("./ConsultancyEvent"));

const ConsultancyDetailPage = ({ consultancy }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState({
    entityType: "consultancy",
    entityId: null,
    entityName: "",
    consultancyId: null,
    consultancyName: "",
  });

  const openInquiryModal = (entityType, entityId, entityName, consultancyId, consultancyName) => {
    if (!entityType || !entityId) {
      console.error("Missing entity type or ID.");
      return;
    }
    setSelectedEntity({ entityType, entityId, entityName, consultancyId, consultancyName });
    setIsModalOpen(true);
  };

  const schemaMarkup = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: consultancy.name,
    description: consultancy.about || "Study abroad consultancy services",
    url: `https://abroadadvise.com/consultancy/${consultancy.slug}`,
    logo: consultancy.logo || "https://abroadadvise.com/logo/default-logo.png", // ✅ FIXED
    contactPoint: {
      "@type": "ContactPoint",
      telephone: consultancy.phone || "",
      contactType: "Customer Service",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: consultancy.city || "",
      addressCountry: consultancy.country || "",
    },
  }), [consultancy]);

  return (
    <>
      <SeoHead
        title={`${consultancy.name} - Study Abroad Consultancy`}
        description={consultancy.about || "Expert study abroad consultancy services"}
        keywords={`study abroad, consultancy, ${consultancy.name}, education`}
        url={`https://abroadadvise.com/consultancy/${consultancy.slug}`}
        image={consultancy.logo || "https://abroadadvise.com/logo/default-logo.png"} // ✅ FIXED
        schemaMarkup={schemaMarkup}
      />

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
            <div className="hidden md:block sticky top-28 h-fit">
              <ConsultancyEvent slug={consultancy.slug} />
            </div>
            <div className="md:hidden">
              <ConsultancyEvent slug={consultancy.slug} />
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <ConsultancyDestinations
              destinations={consultancy.study_abroad_destinations || []}
              openInquiryModal={openInquiryModal}
              consultancyId={consultancy.id}
              consultancyName={consultancy.name}
              verified={consultancy.verified}
            />
            <ConsultancyExams
              exams={consultancy.test_preparation || []}
              openInquiryModal={openInquiryModal}
              consultancyId={consultancy.id}
              consultancyName={consultancy.name}
              verified={consultancy.verified}
            />
            <ConsultancyBranches branches={consultancy.branches || []} />
            <ConsultancyGallery gallery={consultancy.gallery_images || []} />
            <ConsultancyUniversities
              allUniversities={consultancy.partner_universities || []}
              preselectedIds={(consultancy.partner_universities || []).map((u) => u.id)}
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

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${API_URL}/consultancy/${slug}/`);
    if (!res.ok) {
      return { notFound: true };
    }
    const consultancy = await res.json();
    return { props: { consultancy } };
  } catch (err) {
    console.error("Fetch error:", err);
    return { notFound: true };
  }
}

export default ConsultancyDetailPage;
