const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <div className="flex justify-center items-center space-x-4 py-6">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
            >
                Prev
            </button>
            <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;