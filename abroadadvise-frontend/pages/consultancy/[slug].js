"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import {
  MapPin,
  Award,
  MessageSquare,
  Globe,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
} from "lucide-react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ConsultancyInquiry from "../../components/ConsultancyInquiry";

const ConsultancyDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [consultancy, setConsultancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchConsultancy = async () => {
      try {
        const res = await fetch(`${API_URL}/consultancy/${slug}/`);
        if (!res.ok) throw new Error("Failed to fetch consultancy details.");
        const data = await res.json();
        setConsultancy(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load consultancy details.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultancy();
  }, [router.isReady, slug, API_URL]);

  if (loading)
    return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600 font-semibold mt-10">{error}</p>;
  if (!consultancy)
    return <p className="text-center text-gray-600 font-semibold mt-10">Consultancy not found.</p>;

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

      <main className="bg-gray-100 min-h-screen pb-12">
        {/* Cover Photo & Header */}
        <div className="relative w-full h-[300px] bg-gray-300 flex items-center">
          {consultancy.cover_photo ? (
            <img
              src={consultancy.cover_photo}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              No Cover Photo Available
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80"></div>
          <div className="absolute bottom-5 left-5 flex items-center space-x-4">
            {consultancy.logo && (
              <img
                src={consultancy.logo}
                alt="Logo"
                className="w-20 h-20 object-contain bg-white p-2 rounded-md shadow-lg"
              />
            )}
            <div>
              <h1 className="text-white text-3xl font-bold">{consultancy.name}</h1>
              <p className="text-gray-300 flex items-center">
                <MapPin className="h-5 w-5 mr-2" /> {consultancy.address}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column (Contact, Brochure, Map) */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="mt-3 space-y-2 text-gray-700">
                {consultancy.website && (
                  <p className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-blue-500" />
                    <a href={consultancy.website} target="_blank" className="text-blue-600">
                      {consultancy.website}
                    </a>
                  </p>
                )}
                {consultancy.email && (
                  <p className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-500" />
                    {consultancy.email}
                  </p>
                )}
                {consultancy.phone && (
                  <p className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-500" />
                    {consultancy.phone}
                  </p>
                )}
                {consultancy.establishment_date && (
                  <p className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    Established: {consultancy.establishment_date}
                  </p>
                )}
                {consultancy.moe_certified && (
                  <p className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ministry of Education Certified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (About, Services, Destinations, Exams) */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">About {consultancy.name}</h2>
              <p className="mt-3 text-gray-700">{consultancy.about}</p>
            </div>

            {/* Study Abroad Destinations */}
            {consultancy.study_abroad_destinations?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">Study Abroad Destinations</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {consultancy.study_abroad_destinations.map((dest) => (
                    <span
                      key={dest.id}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                    >
                      {dest.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Inquiry Modal */}
      <ConsultancyInquiry
        consultancyId={consultancy.id}
        consultancyName={consultancy.name}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default ConsultancyDetailPage;
