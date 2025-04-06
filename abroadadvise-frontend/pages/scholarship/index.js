// ScholarshipList.js
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "./HeroSection";
import ScholarshipFilters from "./ScholarshipFilters";
import ScholarshipCard from "./ScholarshipCard";
import Pagination from "@/pages/consultancy/Pagination";

const ScholarshipList = ({ initialScholarships, initialTotalPages, destinations }) => {
  const [scholarships, setScholarships] = useState(initialScholarships);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchScholarships = async () => {
    try {
      const queryParams = new URLSearchParams({ page: currentPage });
      if (search) queryParams.append("search", search);
      if (destination) queryParams.append("destination", destination);
      if (studyLevel) queryParams.append("study_level", studyLevel);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarship/?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch scholarships");

      const data = await response.json();
      setScholarships(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      console.error("❌ Error fetching scholarships:", err.message);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [search, destination, studyLevel, currentPage]);

  return (
    <>
      <Head>
        <title>Explore Scholarships for International Students - Abroad Advise</title>
        <meta
          name="description"
          content="Search and discover study abroad scholarships based on country and degree level. Fund your education with the best opportunities."
        />
      </Head>

      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        <ScholarshipFilters
          search={search}
          setSearch={setSearch}
          destination={destination}
          setDestination={setDestination}
          studyLevel={studyLevel}
          setStudyLevel={setStudyLevel}
          destinations={destinations}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {scholarships.length > 0 ? (
            scholarships.map((scholarship) => (
              <ScholarshipCard key={scholarship.slug} scholarship={scholarship} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No scholarships found.</p>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      <Footer />
    </>
  );
};

export async function getServerSideProps() {
  try {
    const [scholarshipRes, destinationRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarship/?page=1`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/?page_size=1000`),
    ]);

    if (!scholarshipRes.ok || !destinationRes.ok) {
      throw new Error("Failed to fetch scholarship or destination data");
    }

    const [scholarshipData, destinationData] = await Promise.all([
      scholarshipRes.json(),
      destinationRes.json(),
    ]);

    return {
      props: {
        initialScholarships: scholarshipData.results || [],
        initialTotalPages: Math.ceil(scholarshipData.count / 10),
        destinations: destinationData.results || [],
      },
    };
  } catch (error) {
    console.error("❌ Error loading scholarship page:", error.message);
    return {
      props: {
        initialScholarships: [],
        initialTotalPages: 1,
        destinations: [],
      },
    };
  }
}

export default ScholarshipList;
