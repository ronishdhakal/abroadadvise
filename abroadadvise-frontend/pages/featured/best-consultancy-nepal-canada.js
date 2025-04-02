"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { API_BASE_URL } from "@/utils/api";
import InquiryModal from "@/components/InquiryModal";
import ConsultancyCard from "@/components/featured/ConsultancyCard";

const FeaturedCanada = () => {
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
  const fetchCanadaConsultancies = async (page = 1) => {
    try {
      const res = await fetch(`${API_BASE_URL}/consultancy/?destination=canada&page=${page}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setConsultancies(data.results || []);
      setTotalPages(Math.ceil(data.count / 10) || 1);
    } catch (error) {
      console.error("Failed to fetch consultancies for Canada:", error);
    }
  };

  useEffect(() => {
    fetchCanadaConsultancies(currentPage);
  }, [currentPage]);

  // ✅ Schema Markup for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Best Consultancy in Nepal for Canada (Top Options for ${currentYear})`,
    description: `Discover the best education consultancies in Nepal for Canada in ${currentYear}. Trusted, verified, and expert guidance for your study abroad journey.`,
    url: "https://www.abroadadvise.com/featured/best-consultancy-nepal-canada",
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
        <title>Best Consultancy in Nepal for Canada (Top Options for {currentYear})</title>
        <meta
          name="description"
          content={`Looking for the best consultancy in Nepal for Canada in ${currentYear}? Explore our curated list of top education consultancies offering expert guidance for studying in Canada.`}
        />
        <meta name="keywords" content={`best consultancy Nepal Canada ${currentYear}, education consultancy Nepal, study in Canada, top consultancies Nepal, abroad advise`} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`Best Consultancy in Nepal for Canada (Top Options for ${currentYear})`} />
        <meta
          property="og:description"
          content={`Discover the top education consultancies in Nepal for Canada in ${currentYear}. Expert, verified advice for your study abroad journey.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.abroadadvise.com/featured/best-consultancy-nepal-canada" />
        <meta property="og:image" content="/images/canada-consultancy-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Best Consultancy in Nepal for Canada (Top Options for ${currentYear})`} />
        <meta
          name="twitter:description"
          content={`Check out the best consultancies in Nepal for Canada in ${currentYear} for your study abroad needs.`}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <link rel="canonical" href="https://www.abroadadvise.com/featured/best-consultancy-nepal-canada" />
      </Head>

      <Header />

      <main className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 bg-white">
        <section className="pt-8 pb-12 text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold text-gray-900 mb-3 leading-tight tracking-tight">
            Best Consultancy in Nepal for Canada (Top Options for {currentYear})
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-light max-w-3xl leading-relaxed">
            As the interest in international education is growing every day, Canada is becoming one of the popular destinations for Nepalese students. Canada is known for its high-quality education, diverse culture, and decent post-study work opportunities. Here, we have listed the top 10 best education consultancies in Nepal for studying in Canada.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-light max-w-3xl leading-relaxed mt-4">
            Choosing the right education consultancy is crucial to finding the right course at the right college/university and completing the application process. In this article, we have provided a comprehensive overview of the top 10 best education consultancies in Nepal that specialize in helping students to achieve their dream of studying in Canada from Nepal.
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 mt-6 mb-4 leading-tight">
            Best Consultancy in Nepal for Canada
          </h2>
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
              <p className="text-base sm:text-lg text-gray-500 font-light italic">No consultancies found for Canada at this time.</p>
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

        {/* Additional Content */}
        <section className="pt-8 pb-12 text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            Why Study in Canada?
          </h2>
          <ul className="text-base sm:text-lg text-gray-700 font-light space-y-3 max-w-3xl">
            <li>
              <strong>Quality Education:</strong> Canada is home to universities and colleges with high academic standards and rigorous quality controls.
            </li>
            <li>
              <strong>Affordable Education:</strong> Compared to other popular countries like Australia, the USA, and the UK, Canada offers more affordable tuition fees and living costs.
            </li>
            <li>
              <strong>Post-Study Work Opportunities:</strong> Once you complete your graduation, you can get a post-graduation work permit which helps you get valuable work experience and earn as well.
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 mt-8 mb-4 leading-tight">
            Criteria for Selection of the Best Consultancy for Canada in Nepal
          </h2>
          <ul className="text-base sm:text-lg text-gray-700 font-light space-y-3 max-w-3xl">
            <li>
              <strong>Accreditation and Certifications:</strong> Ensure the consultancy is accredited by relevant educational bodies like Ministry of Education.
            </li>
            <li>
              <strong>Experience and Success Rate:</strong> Look for a consultancy with a proven track record of successful applications.
            </li>
            <li>
              <strong>Range of Service:</strong> The consultancy should offer all services including test preparation, visa assistance, and post-study support.
            </li>
          </ul>
        </section>
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

export default FeaturedCanada;