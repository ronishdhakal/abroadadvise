"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import NewsHeroSection from "./HeroSection";
import NewsFilter from "./NewsFilter";
import NewsCard from "./NewsCard";
import NewsPagination from "./NewsPagination";
import { Search, Filter } from "lucide-react";

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/categories/`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.results || []);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch news with filters
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/news/`);
        url.searchParams.append("page", currentPage);
        if (searchQuery) url.searchParams.append("search", searchQuery);
        if (category) url.searchParams.append("category", category);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch news");

        const data = await response.json();
        setNewsList(data.results || []);
        setTotalPages(Math.ceil(data.count / 10)); // Use count instead of total_pages
      } catch (error) {
        setError(error.message);
      }
    };

    fetchNews();
  }, [currentPage, searchQuery, category]);

  return (
    <>
      <Head>
        <title>Study Abroad News & Updates - Abroad Advise</title>
        <meta name="description" content="Stay informed with the latest study abroad news, announcements, and updates for Nepalese students." />
      </Head>

      <Header />
      <NewsHeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
        {/* 🔍 Search & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page
              }}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-black text-sm"
            />
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Filter className="h-5 w-5 mr-2" />
            {isFilterOpen ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {/* 🧩 Filter Options */}
        {isFilterOpen && (
          <NewsFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            category={category}
            setCategory={setCategory}
            categories={categories}
          />
        )}

        {/* 📰 News Grid */}
        {error && <p className="text-center text-red-500 mt-4">Error: {error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {newsList.length > 0 ? (
            newsList.map((news) => <NewsCard key={news.slug} news={news} />)
          ) : (
            <p className="text-center col-span-full text-gray-500">No news found.</p>
          )}
        </div>

        {/* 📄 Pagination */}
        {totalPages > 1 && (
          <NewsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
