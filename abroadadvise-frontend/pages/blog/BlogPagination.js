import { ChevronLeft, ChevronRight } from "lucide-react";

const BlogPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null; // ✅ Hide pagination if totalPages is 1 or less

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center space-x-2 bg-white py-4 shadow-md rounded-lg border">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 border rounded-lg ${
            currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default BlogPagination;
