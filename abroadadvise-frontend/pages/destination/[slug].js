"use client";

import { useState, useMemo } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import Footer from "@/components/footer";
import InquiryModal from "@/components/InquiryModal";

// Static imports for critical components
import DestinationHeader from "../destination/DestinationHeader";
import DestinationOverview from "../destination/DestinationOverview";
import DestinationConsultancies from "../destination/DestinationConsultancies";
import DestinationUniversities from "../destination/DestinationUniversities";
import DestinationCourses from "../destination/DestinationCourses";

// Lazy-loaded non-critical components with skeleton loaders
const DestinationWhyChoose = dynamic(() => import("../destination/DestinationWhyChoose"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  ),
});
const DestinationRequirements = dynamic(() => import("../destination/DestinationRequirements"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  ),
});
const DestinationDocumentsRequired = dynamic(() => import("../destination/DestinationDocumentsRequired"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  ),
});
const DestinationScholarships = dynamic(() => import("../destination/DestinationScholarships"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  ),
});
const DestinationMoreInformation = dynamic(() => import("../destination/DestinationMoreInformation"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  ),
});
const DestinationOtherDestinations = dynamic(() => import("../destination/DestinationOtherDestinations"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
});
const Custom404 = dynamic(() => import("../404"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
    </div>
  ),
});

const DestinationDetail = ({ destination, universities, courses, consultancies, destinations }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Memoize large datasets to prevent re-renders
  const memoizedUniversities = useMemo(() => {
    return universities.sort((a, b) => a.name?.localeCompare(b.name) || 0);
  }, [universities]);

  const memoizedCourses = useMemo(() => {
    return courses.filter(course => course.is_active !== false);
  }, [courses]);

  const memoizedDestinations = useMemo(() => {
    return destinations.slice(0, 5); // Limit to top 5 for performance
  }, [destinations]);

  if (!destination) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>Study in {destination.title} from Nepal - Abroad Advise</title>
        <meta
          name="description"
          content={`Explore studying in ${destination.title}. Learn about universities, courses, scholarships, and requirements.`}
        />
      </Head>

      <Header />

      {/* Full-Width Destination Header */}
      <div className="w-full p-0 m-0">
        <DestinationHeader
          destination={destination}
          setIsModalOpen={setIsModalOpen}
          setSelectedEntity={setSelectedEntity}
        />
      </div>

      {/* Content Sections */}
      <div className="container mx-auto p-4 space-y-6 md:px-10 lg:px-16 py-0 xl:px-24">
        {/* Destination Overview */}
        <div className="w-full">
          <DestinationOverview
            destination={destination}
            universities={memoizedUniversities}
            courses={memoizedCourses}
            consultancies={consultancies}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <aside className="space-y-6 md:col-span-1">
            <DestinationConsultancies destination={destination} consultancies={consultancies} />
            <DestinationUniversities destination={destination} universities={memoizedUniversities} />
          </aside>

          {/* Right Section - Main Content */}
          <section className="md:col-span-2 space-y-6">
            <DestinationCourses destination={destination} courses={memoizedCourses} />
            {destination.why_choose && <DestinationWhyChoose destination={destination} />}
            {destination.scholarships && <DestinationScholarships destination={destination} />}
            {destination.requirements && <DestinationRequirements destination={destination} />}
            {destination.documents_required && <DestinationDocumentsRequired destination={destination} />}
            {destination.more_information && <DestinationMoreInformation destination={destination} />}
            <DestinationOtherDestinations destinations={memoizedDestinations} currentSlug={destination.slug} />
          </section>
        </div>
      </div>

      <Footer />

      {selectedEntity && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType={selectedEntity.entityType}
          entityId={selectedEntity.entityId}
          entityName={selectedEntity.entityName}
          additionalData={{
            destinationId: destination.id,
            destinationName: destination.title,
          }}
        />
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const startTime = Date.now();

  try {
    // Try single endpoint if available
    const res = await fetch(`${API_URL}/destination/${slug}/full`);
    if (res.ok) {
      const data = await res.json();
      console.log(`Single endpoint fetch took: ${Date.now() - startTime}ms`);
      return {
        props: {
          destination: data.destination,
          universities: data.universities || [],
          courses: data.courses || [],
          consultancies: data.consultancies || [],
          destinations: data.otherDestinations?.slice(0, 5) || [], // Limit to 5
        },
      };
    }

    // Fallback to multiple API calls
    console.warn("Falling back to multiple API calls");
    const destStart = Date.now();
    const destRes = await fetch(`${API_URL}/destination/${slug}/`);
    if (!destRes.ok) {
      console.error(`Destination fetch failed: ${destRes.status}`);
      return { notFound: true };
    }
    const destination = await destRes.json();
    console.log(`Destination fetch took: ${Date.now() - destStart}ms`);

    const uniStart = Date.now();
    const uniRes = await fetch(`${API_URL}/university/?country=${destination.title}`);
    const uniData = await uniRes.json();
    console.log(`Universities fetch took: ${Date.now() - uniStart}ms`);

    const courseStart = Date.now();
    const courseRes = await fetch(`${API_URL}/course/?destination=${destination.id}`);
    const courseData = await courseRes.json();
    console.log(`Courses fetch took: ${Date.now() - courseStart}ms`);

    const consStart = Date.now();
    const consRes = await fetch(`${API_URL}/consultancy/`);
    const consData = await consRes.json();
    const filteredConsultancies = consData.results.filter(cons =>
      Array.isArray(cons.study_abroad_destinations) &&
      cons.study_abroad_destinations.some(dest => dest.id === destination.id)
    );
    console.log(`Consultancies fetch took: ${Date.now() - consStart}ms`);

    const allDestStart = Date.now();
    const allDestRes = await fetch(`${API_URL}/destination/`);
    const allDestData = await allDestRes.json();
    console.log(`All destinations fetch took: ${Date.now() - allDestStart}ms`);

    console.log(`Total fetch time: ${Date.now() - startTime}ms`);

    return {
      props: {
        destination,
        universities: uniData.results || [],
        courses: courseData.results || [],
        consultancies: filteredConsultancies,
        destinations: allDestData.results.slice(0, 5) || [], // Limit to 5
      },
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return { notFound: true };
  }
}

export default DestinationDetail;