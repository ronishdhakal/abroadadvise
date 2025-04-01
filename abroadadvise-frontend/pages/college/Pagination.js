"use client";

import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const router = useRouter();

  if (!totalPages || totalPages <= 1) return null; // ✅ Don't show if unnecessary

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);

      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: newPage },
      });
    }
  };

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center space-x-2 bg-white py-4 shadow-md rounded-lg border">
      {/* Previous Button */}
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => changePage(page)}
          className={`px-4 py-2 border rounded-lg ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
};

export default Pagination;
