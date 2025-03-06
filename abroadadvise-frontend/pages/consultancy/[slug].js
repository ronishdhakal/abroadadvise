import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  FileText,
  Award,
  ExternalLink,
  MapIcon,
} from "lucide-react";

const ConsultancyPage = () => {
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
        setError("Failed to load consultancy details.");
        setLoading(false);
      });
  }, [router.isReady, slug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!consultancy) return <p>Consultancy not found.</p>;

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

      {/* Hero Section */}
      <div className="relative h-48 md:h-64 w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${consultancy.cover_photo})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-900/90"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold">{consultancy.name}</h1>
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              <p className="text-sm md:text-base text-gray-100">{consultancy.address}</p>
            </div>
            {consultancy.moe_certified && (
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Award className="h-3 w-3 mr-1" />
                MOE Certified
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 md:-mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Info Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {consultancy.logo && (
                  <img
                    src={consultancy.logo}
                    alt="Logo"
                    className="w-24 h-24 object-contain border rounded-md shadow"
                  />
                )}
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {consultancy.website && (
                      <a
                        href={consultancy.website}
                        target="_blank"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        {consultancy.website}
                      </a>
                    )}
                    {consultancy.phone && (
                      <a
                        href={`tel:${consultancy.phone}`}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        {consultancy.phone}
                      </a>
                    )}
                    {consultancy.email && (
                      <a
                        href={`mailto:${consultancy.email}`}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {consultancy.email}
                      </a>
                    )}
                    {consultancy.establishment_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Est. {new Date(consultancy.establishment_date).getFullYear()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: consultancy.about || "<p>No description available.</p>",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
              <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <h2 className="text-lg font-semibold">Contact Us</h2>
                <p className="text-sm text-blue-100">Get in touch for personalized guidance</p>
              </div>
              <div className="p-5">
                <form className="space-y-4">
                  <input type="text" placeholder="Your name" className="input-style" />
                  <input type="email" placeholder="Your email" className="input-style" />
                  <input type="tel" placeholder="Your phone number" className="input-style" />
                  <textarea placeholder="How can we help you?" className="input-style" rows="3"></textarea>
                  <button className="w-full btn-primary">Send Message</button>
                </form>
              </div>
            </div>

            {/* Map Location */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-5">
                <h2 className="text-lg font-semibold">Our Location</h2>
                <p className="text-sm text-gray-600">{consultancy.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${consultancy.latitude},${consultancy.longitude}`}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Get Directions
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ConsultancyPage;
