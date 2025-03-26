"use client";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  // Generate page numbers (simple range for now)
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      <button
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 py-1 rounded border ${
          isFirst ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"
        }`}
      >
        ⬅ Prev
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 rounded border ${
            currentPage === number
              ? "bg-blue-500 text-white font-semibold"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {number}
        </button>
      ))}

      <button
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-3 py-1 rounded border ${
          isLast ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"
        }`}
      >
        Next ➡
      </button>
    </div>
  );
};

export default Pagination;
