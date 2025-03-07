import { Search, MapPin } from "lucide-react";

const UniversityFilters = ({ searchQuery, setSearchQuery, countryQuery, setCountryQuery }) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black">Advanced Filters</h2> {/* Changed text color to black */}
        <button
          onClick={() => {
            setSearchQuery("");
            setCountryQuery("");
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* University Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a university..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
            aria-label="Search Universities"
          />
        </div>

        {/* Country Name Search Field */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by country name..."
            value={countryQuery}
            onChange={(e) => setCountryQuery(e.target.value)}
            className="w-full pl-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
            aria-label="Search by Country"
          />
        </div>
      </div>
    </div>
  );
};

export default UniversityFilters;
