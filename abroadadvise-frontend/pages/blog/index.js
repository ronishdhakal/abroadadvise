"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import BlogHeroSection from "./BlogHeroSection";
import BlogFilter from "./BlogFilter";
import BlogCard from "./BlogCard";
import BlogPagination from "./BlogPagination";
import { Search, Filter } from "lucide-react";
import { useRouter } from "next/router";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const router = useRouter();

  // ✅ Fetch Blogs on Filters or Page Change
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", currentPage);
        if (searchQuery) queryParams.append("search", searchQuery); // ✅ Correct key
        if (category) queryParams.append("category", category);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/blog/?${queryParams.toString()}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed to fetch blogs");

        const data = await res.json();
        setBlogs(data.results || []);
        setTotalPages(Math.ceil(data.count / 10) || 1);

        // ✅ Update URL without reload
        router.push(`/blog?${queryParams.toString()}`, undefined, { shallow: true });
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Something went wrong while loading blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [searchQuery, category, currentPage]);

  return (
    <>
      <Head>
        <title>Study Abroad Blogs - Abroad Advise</title>
        <meta name="description" content="Read helpful blogs for Nepalese students planning to study abroad." />
      </Head>

      <Header />
      <BlogHeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-white">
        <div className="flex items-center gap-4">
          {/* ✅ Search Bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // ✅ Reset page on search
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
              aria-label="Search Blogs"
            />
          </div>

          {/* ✅ Toggle Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <Filter className="h-5 w-5 mr-2" />
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {/* ✅ Filter Panel */}
        {showFilters && (
          <div className="mt-4">
            <BlogFilter category={category} setCategory={(val) => {
              setCategory(val);
              setCurrentPage(1); // ✅ Reset to first page on category change
            }} />
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-8">Loading blogs...</p>
      ) : (
        <>
          {blogs.length > 0 ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <BlogCard key={blog.slug} blog={blog} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-8">No blogs found.</p>
          )}

          {/* ✅ Pagination */}
          {totalPages > 1 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex justify-center">
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      <Footer />
    </>
  );
};

export default BlogList;
