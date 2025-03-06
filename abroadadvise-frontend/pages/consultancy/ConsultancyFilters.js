import { MapPin, Globe, FileText, Award, Search } from "lucide-react";

const ConsultancyFilters = ({
  search,
  setSearch,
  district,
  setDistrict,
  destination,
  setDestination,
  exam,
  setExam,
  moeCertified,
  setMoeCertified,
  exams,
  destinations, // Added destinations list
}) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Advanced Filters</h3>
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={() => {
            setSearch("");
            setDistrict("");
            setDestination("");
            setExam("");
            setMoeCertified("");
          }}
        >
          Clear all filters
        </button>
      </div>

      {/* 🔹 Filter Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 🔍 Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search consultancies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm"
          />
        </div>

        {/* 📌 District Filter */}
        <div>
          <label className="text-sm font-medium text-gray-800 flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" /> District
          </label>
          <input
            type="text"
            placeholder="Filter by district..."
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          />
        </div>

        {/* 🌍 Destination Dropdown (Dynamic) */}
        <div>
          <label className="text-sm font-medium text-gray-800 flex items-center">
            <Globe className="h-4 w-4 mr-2 text-gray-500" /> Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            <option value="">🌍 All Destinations</option>
            {destinations.length > 0 ? (
              destinations.map((dest) => (
                <option key={dest.id} value={dest.slug}>
                  {dest.name}
                </option>
              ))
            ) : (
              <option disabled>Loading destinations...</option>
            )}
          </select>
        </div>

        {/* 📝 Exam Preparation Dropdown (Dynamic) */}
        <div>
          <label className="text-sm font-medium text-gray-800 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-500" /> Exam Preparation
          </label>
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            <option value="">📝 All Exams</option>
            {exams.length > 0 ? (
              exams.map((examItem) => (
                <option key={examItem.id} value={examItem.slug}>
                  {examItem.name}
                </option>
              ))
            ) : (
              <option disabled>Loading exams...</option>
            )}
          </select>
        </div>

        {/* 🏆 MOE Certification Dropdown */}
        <div>
          <label className="text-sm font-medium text-gray-800 flex items-center">
            <Award className="h-4 w-4 mr-2 text-gray-500" /> MOE Certification
          </label>
          <select
            value={moeCertified}
            onChange={(e) => setMoeCertified(e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            <option value="">🏆 Any Status</option>
            <option value="true">✅ Certified Only</option>
            <option value="false">❌ Non-Certified Only</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ConsultancyFilters;
