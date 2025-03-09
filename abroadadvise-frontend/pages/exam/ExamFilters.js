import { Search, FileText } from "lucide-react";

const ConsultancyFilters = ({ search, setSearch, type, setType }) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black">Filters</h2>
        <button
          onClick={() => {
            setSearch("");
            setType("");
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search consultancies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
            aria-label="Search Consultancies"
          />
        </div>

        {/* Type Dropdown */}
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm bg-white text-gray-900 text-sm"
            aria-label="Select Type"
          >
            <option value="">All Types</option>
            <option value="english_proficiency">English Proficiency Test</option>
            <option value="standardized_test">Standardized Test</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ConsultancyFilters;
