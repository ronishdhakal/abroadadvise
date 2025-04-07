"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import InquiryModal from "@/components/InquiryModal";
import ConsultancyCard from "@/components/featured/ConsultancyCard";
import { API_BASE_URL } from "@/utils/api";

const FeaturedPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [pageData, setPageData] = useState(null);
  const [consultancies, setConsultancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/featured/${slug}/`);
        const featured = await res.json();
        setPageData(featured);

        const consultRes = await fetch(`${API_BASE_URL}/${featured.api_route}`);
        const consultData = await consultRes.json();
        setConsultancies(consultData.results || []);
      } catch (err) {
        console.error("Error loading featured page:", err);
        setError("Failed to load featured data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleApply = (entity) => {
    setSelectedEntity(entity);
    setIsModalOpen(true);
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${pageData.title} (${currentYear})`,
    description: pageData.meta_description,
    url: `https://www.abroadadvise.com/featured/${slug}`,
  };

  return (
    <>
      <Head>
        <title>{pageData.meta_title || pageData.title}</title>
        <meta name="description" content={pageData.meta_description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      <Header />

      <main className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        {/* 🔹 Top Section */}
        <section className="text-left mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-gray-900 leading-tight">
            Best Consultancy in Nepal for {pageData.destination || "your destination"} ({currentYear})
          </h1>
          <div
            className="prose prose-blue max-w-3xl text-gray-700 mt-4"
            dangerouslySetInnerHTML={{ __html: pageData.description_top }}
          ></div>
        </section>

        {/* 🔹 Sub Title as H2 */}
        {pageData.sub_title && (
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {pageData.sub_title}
          </h2>
        )}

        {/* 🔹 Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-start">
          {consultancies.length > 0 ? (
            consultancies.map((consultancy) => (
              <ConsultancyCard key={consultancy.id} consultancy={consultancy} onApply={handleApply} />
            ))
          ) : (
            <p className="text-gray-500 italic">No consultancies found.</p>
          )}
        </section>

        {/* 🔹 Bottom Section */}
        <section className="pt-10">
          <div
            className="prose prose-blue max-w-3xl text-gray-700 mt-4"
            dangerouslySetInnerHTML={{ __html: pageData.description_bottom }}
          ></div>
        </section>
      </main>

      <Footer />

      {/* 🔹 Inquiry Modal */}
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

export default FeaturedPage;
