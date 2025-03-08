import { Search } from "lucide-react";

const DestinationFilters = ({ search, setSearch }) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black">Search Destinations</h2>
        <button
          onClick={() => setSearch("")}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
          aria-label="Search Destinations"
        />
      </div>
    </div>
  );
};

export default DestinationFilters;
