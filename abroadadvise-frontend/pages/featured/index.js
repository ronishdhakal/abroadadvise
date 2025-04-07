"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getFeaturedPages } from "@/utils/api";

const FeaturedIndex = () => {
  const [featuredPages, setFeaturedPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFeaturedPages({ page: 1, search: "" })
      .then((data) => {
        setFeaturedPages(data.results || []);
      })
      .catch((err) => {
        console.error("❌ Failed to load featured pages:", err);
        setError("Failed to load featured pages");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Featured Study Abroad Guides - Abroad Advise</title>
        <meta
          name="description"
          content="Explore curated lists of top consultancies for popular destinations like Canada, USA, UK and more."
        />
      </Head>

      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
        <section className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
            Featured Study Abroad Guides
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Discover expertly curated lists of the best education consultancies in Nepal for your study abroad journey.
          </p>
        </section>

        {loading ? (
          <p className="text-center text-gray-600 mt-8">Loading featured pages...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-8">{error}</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPages.map((page) => (
              <div
                key={page.slug}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:-translate-y-1"
              >
                <Link href={`/featured/${page.slug}`} className="flex items-center gap-3">
                  <span className="text-2xl">{page.flag_emoji || "🌍"}</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-[#4c9bd5] transition-colors duration-200">
                    {page.title}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 font-light">
            More destinations coming soon — stay tuned for updates!
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default FeaturedIndex;
