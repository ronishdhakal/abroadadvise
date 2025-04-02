"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { API_BASE_URL } from "@/utils/api";
import InquiryModal from "@/components/InquiryModal";
import ConsultancyCard from "@/components/featured/ConsultancyCard";

const FeaturedAustralia = () => {
  const [consultancies, setConsultancies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const currentYear = new Date().getFullYear();

  // ✅ When "Ask a Question" is clicked
  const handleApply = (entity) => {
    setSelectedEntity(entity);
    setIsModalOpen(true);
  };

  // ✅ Fetch consultancies filtered by destination
  const fetchAustraliaConsultancies = async (page = 1) => {
    try {
      const res = await fetch(`${API_BASE_URL}/consultancy/?destination=australia&page=${page}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setConsultancies(data.results || []);
      setTotalPages(Math.ceil(data.count / 10) || 1);
    } catch (error) {
      console.error("Failed to fetch consultancies for Australia:", error);
    }
  };

  useEffect(() => {
    fetchAustraliaConsultancies(currentPage);
  }, [currentPage]);

  // ✅ Schema Markup for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Best Consultancy in Nepal for Australia (Top Options for ${currentYear})`,
    description: `Discover the best education consultancies in Nepal for Australia in ${currentYear}. Trusted, verified, and expert guidance for your study abroad journey.`,
    url: "https://www.abroadadvise.com/featured/best-consultancy-nepal-australia",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: consultancies.map((consultancy, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Organization",
          name: consultancy.name,
          address: consultancy.address || "Nepal",
          telephone: consultancy.phone || "",
          email: consultancy.email || "",
          url: consultancy.website || "",
        },
      })),
    },
  };

  return (
    <>
      <Head>
        <title>Best Consultancy in Nepal for Australiuia (Top Options for {currentYear})</title>
        <meta
          name="description"
          content={`Looking for the best consultancy in Nepal for Australia in ${currentYear}? Explore our curated list of top education consultancies offering expert guidance for studying in Australia.`}
        />
        <meta name="keywords" content={`best consultancy Nepal Australia ${currentYear}, education consultancy Nepal, study in Australia, top consultancies Nepal, abroad advise`} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`Best Consultancy in Nepal for Australia (Top Options for ${currentYear})`} />
        <meta
          property="og:description"
          content={`Discover the top education consultancies in Nepal for Australua in ${currentYear}. Expert, verified advice for your study abroad journey.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.abroadadvise.com/featured/best-consultancy-nepal-australia" />
        <meta property="og:image" content="/images/australia-consultancy-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Best Consultancy in Nepal for Australia (Top Options for ${currentYear})`} />
        <meta
          name="twitter:description"
          content={`Check out the best consultancies in Nepal for Australia in ${currentYear} for your study abroad needs.`}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <link rel="canonical" href="https://www.abroadadvise.com/featured/best-consultancy-nepal-australia" />
      </Head>

      <Header />

      <main className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 bg-white">
        <section className="pt-8 pb-12 text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold text-gray-900 mb-3 leading-tight tracking-tight">
            Best Consultancy in Nepal for Australua (Top Options for {currentYear})
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-light max-w-3xl leading-relaxed">
            Unlock your Australian study dreams with Nepal’s premier education consultancies, curated for {currentYear}.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-start">
          {consultancies.length > 0 ? (
            consultancies.map((consultancy) => (
              <ConsultancyCard
                key={consultancy.id}
                consultancy={consultancy}
                onApply={handleApply}
              />
            ))
          ) : (
            <div className="text-left">
              <p className="text-base sm:text-lg text-gray-500 font-light italic">No consultancies found for Australia at this time.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 pb-12 flex justify-start items-center gap-2 sm:gap-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-[#4c9bd5] to-[#3a8cc1] text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:shadow-md"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Inquiry Modal */}
      <InquiryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        entityType={selectedEntity?.entityType}
        entityId={selectedEntity?.entityId}
        entityName={selectedEntity?.entityName}
        consultancyId={selectedEntity?.consultancyId}
        consultancyName={selectedEntity?.consultancyName}
        destination={selectedEntity?.destination}
      />
    </>
  );
};

export default FeaturedAustralia;