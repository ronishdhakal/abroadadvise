import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import InquiryModal from "@/components/InquiryModal";
import ConsultancyCard from "@/components/featured/ConsultancyCard";
import Pagination from "@/pages/featured/Pagination"; // ✅ Import pagination
import { API_BASE_URL } from "@/utils/api";
import { useState } from "react";

const FeaturedPage = ({ pageData, consultancies, currentPage, totalPages }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const currentYear = new Date().getFullYear();

  const handleApply = (entity) => {
    setSelectedEntity(entity);
    setIsModalOpen(true);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${pageData.title} (${currentYear})`,
    description: pageData.meta_description,
    url: `https://www.abroadadvise.com/featured/${pageData.slug}`,
  };

  return (
    <>
      <Head>
        <title>{pageData.meta_title || `${pageData.title} | Abroad Advise`}</title>
        <meta name="description" content={pageData.meta_description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.abroadadvise.com/featured/${pageData.slug}`} />
        <meta property="og:title" content={pageData.meta_title || pageData.title} />
        <meta property="og:description" content={pageData.meta_description} />
        <meta property="og:url" content={`https://www.abroadadvise.com/featured/${pageData.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Abroad Advise" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageData.meta_title || pageData.title} />
        <meta name="twitter:description" content={pageData.meta_description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      <Header />

      <main className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        {/* 🔹 Top Section */}
        <section className="text-left mb-10" aria-labelledby="featured-page-heading">
          <h1
            id="featured-page-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-gray-900 leading-tight"
          >
            Best Consultancy in Nepal for {pageData.destination || "your destination"} ({currentYear})
          </h1>

          {pageData.description_top && (
            <div
              className="prose prose-blue max-w-3xl text-gray-700 mt-4"
              dangerouslySetInnerHTML={{ __html: pageData.description_top }}
            />
          )}
        </section>

        {/* 🔹 Sub Title */}
        {pageData.sub_title && (
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {pageData.sub_title}
          </h2>
        )}

        {/* 🔹 Consultancies Grid */}
        <section
          aria-labelledby="consultancy-list-heading"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-start"
        >
          <h2 id="consultancy-list-heading" className="sr-only">
            List of top consultancies for {pageData.destination}
          </h2>

          {consultancies.length > 0 ? (
            consultancies.map((consultancy) => (
              <ConsultancyCard
                key={consultancy.id}
                consultancy={consultancy}
                onApply={handleApply}
              />
            ))
          ) : (
            <p className="text-gray-500 italic">No consultancies found.</p>
          )}
        </section>

        {/* 🔹 Pagination Component */}
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>

        {/* 🔹 Bottom Section */}
        {pageData.description_bottom && (
          <section className="pt-10">
            <div
              className="prose prose-blue max-w-3xl text-gray-700 mt-4"
              dangerouslySetInnerHTML={{ __html: pageData.description_bottom }}
            />
          </section>
        )}
      </main>

      <Footer />

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

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const page = context.query.page || 1;

  try {
    const featuredRes = await fetch(`${API_BASE_URL}/featured/${slug}/`);
    const featured = await featuredRes.json();

    if (!featured?.api_route) {
      return { notFound: true };
    }

    const consultRes = await fetch(`${API_BASE_URL}/${featured.api_route}&page=${page}&page_size=12`);
    const consultData = await consultRes.json();

    return {
      props: {
        pageData: featured,
        consultancies: consultData.results || [],
        currentPage: parseInt(page),
        totalPages: Math.ceil(consultData.count / 12),
      },
    };
  } catch (error) {
    console.error("❌ Error in SSR:", error);
    return { notFound: true };
  }
}

export default FeaturedPage;
