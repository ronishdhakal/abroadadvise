"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScholarshipHeader from "./ScholarshipHeader";
import ScholarshipAbout from "./ScholarshipAbout";
import { API_BASE_URL } from "@/utils/api";

const ScholarshipDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const fetchScholarship = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/scholarship/${slug}/`);
        if (!response.ok) throw new Error("Failed to fetch scholarship");
        const data = await response.json();
        setScholarship(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarship();
  }, [slug]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!scholarship) return <div className="text-center py-20 text-gray-400">Scholarship not found.</div>;

  return (
    <>
      <Head>
        <title>{scholarship.title} | Abroad Advise</title>
        <meta name="description" content={scholarship.by || "Scholarship Details"} />
      </Head>

      <Header />

      {/* Center-aligned content wrapper */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ScholarshipHeader scholarship={scholarship} />
        <ScholarshipAbout scholarship={scholarship} />
      </main>

      <Footer />
    </>
  );
};

export default ScholarshipDetailPage;
