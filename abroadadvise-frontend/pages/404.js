import { useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { FaExclamationTriangle, FaHome, FaArrowLeft } from "react-icons/fa"; // ✅ Icons
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/pages/home/HeroSection"; // ✅ Importing HeroSection

export default function Custom404() {
  useEffect(() => {
    console.log("✅ Custom 404 Page Rendered!");
  }, []);

  return (
    <>
      <Head>
        <title>404 - Page Not Found | Abroad Advise</title>
      </Head>

      {/* ✅ Include Header */}
      <Header />
{/* ✅ HeroSection (Guiding Users) */}
<HeroSection />
      {/* ✅ 404 Page Main Container */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 text-center px-6 py-10">
        {/* ❌ Warning Icon */}
        <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />

        {/* 404 Title */}
        <h1 className="text-5xl font-bold text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-2">Oops! Page Not Found</h2>
        <p className="text-gray-600 mt-2 max-w-lg">
          The page you are looking for doesn't exist or may have been moved.
          Try checking the URL or go back to the homepage.
        </p>

        {/* 🔄 Navigation Options */}
        <div className="mt-6 flex space-x-4">
          <Link href="/">
            <span className="flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 transition cursor-pointer shadow-md">
              <FaHome className="mr-2" /> Go Home
            </span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center px-6 py-3 border border-gray-400 text-gray-800 text-lg font-medium rounded-md hover:bg-gray-200 transition cursor-pointer shadow-md"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>

      

      {/* ✅ Include Footer */}
      <Footer />
    </>
  );
}
