"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  FileText,
  Award,
} from "lucide-react";
import Header from "../../components/header";
import Footer from "../../components/footer";

const ConsultancyDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [consultancy, setConsultancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    if (!slug) return console.error("Slug is undefined!");

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/consultancy/${slug}/`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setConsultancy(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load consultancy details.");
        setLoading(false);
      });
  }, [router.isReady, slug]);

  if (loading)
    return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-600 font-semibold mt-10">{error}</p>
    );
  if (!consultancy)
    return (
      <p className="text-center text-gray-600 font-semibold mt-10">
        Consultancy not found.
      </p>
    );

  return (
    <>
      <Head>
        <title>{consultancy.name} - Consultancy</title>
        <meta
          name="description"
          content={consultancy.about || "Study abroad consultancy details"}
        />
      </Head>

      <Header />

      <main className="bg-white text-black min-h-screen pb-12">
        {/* Cover Photo Section */}
        <div className="relative h-[420px] w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${consultancy.cover_photo})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Consultancy Info */}
              <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col sm:flex-row items-center">
                {consultancy.logo && (
                  <img
                    src={consultancy.logo}
                    alt="Logo"
                    className="w-28 h-28 object-contain border rounded-md shadow"
                  />
                )}
                <div className="ml-6">
                  <h1 className="text-3xl font-bold">{consultancy.name}</h1>
                  <div className="flex items-center mt-2 text-gray-700">
                    <MapPin className="h-5 w-5 mr-2" />
                    {consultancy.address}
                  </div>
                  {consultancy.moe_certified && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                      <Award className="h-4 w-4 mr-2" />
                      MOE Certified
                    </div>
                  )}
                </div>
              </div>

              {/* Contact & Website */}
              <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {consultancy.website && (
                  <Link href={consultancy.website} target="_blank">
                    <div className="text-blue-600 hover:underline flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Visit Website
                    </div>
                  </Link>
                )}
                {consultancy.phone && (
                  <Link href={`tel:${consultancy.phone}`}>
                    <div className="text-blue-600 hover:underline flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      {consultancy.phone}
                    </div>
                  </Link>
                )}
                {consultancy.email && (
                  <Link href={`mailto:${consultancy.email}`}>
                    <div className="text-blue-600 hover:underline flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      {consultancy.email}
                    </div>
                  </Link>
                )}
              </div>

              {/* About Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: consultancy.about || "<p>No description available.</p>",
                  }}
                />
              </div>

              {/* Study Abroad Destinations */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Study Abroad Destinations
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {consultancy.study_abroad_destinations.map((dest) => (
                    <Link
                      href={`/destination/${dest.slug}`}
                      key={dest.slug}
                      className="p-4 bg-gray-100 rounded-md text-center hover:bg-gray-200"
                    >
                      {dest.icon} {dest.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Test Preparation */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Test Preparation</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {consultancy.test_preparation.map((exam) => (
                    <Link
                      href={`/exam/${exam.slug}`}
                      key={exam.slug}
                      className="p-4 bg-gray-100 rounded-md text-center hover:bg-gray-200"
                    >
                      <img
                        src={exam.icon}
                        alt={exam.name}
                        className="w-10 h-10 mx-auto mb-2"
                      />
                      {exam.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Partner Universities */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Partner Universities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {consultancy.partner_universities.map((uni) => (
                    <Link
                      href={`/university/${uni.slug}`}
                      key={uni.slug}
                      className="p-4 bg-gray-100 rounded-md text-center hover:bg-gray-200"
                    >
                      <img
                        src={uni.logo}
                        alt={uni.name}
                        className="w-12 h-12 mx-auto mb-2"
                      />
                      {uni.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ConsultancyDetailPage;
