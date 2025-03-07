import { Search, Award, FileText, MapPin, Globe } from "lucide-react";
import Select from "react-select";

const ConsultancyFilters = ({
  search,
  setSearch,
  selectedDistricts,
  setSelectedDistricts,
  destination,
  setDestination,
  exam,
  setExam,
  moeCertified,
  setMoeCertified,
  exams,
  destinations,
  districts,
}) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Advanced Filters</h2>
        <button
          onClick={() => {
            setSearch("");
            setSelectedDistricts([]);
            setDestination("");
            setExam("");
            setMoeCertified("");
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search consultancies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
          />
        </div>

        {/* District Multi-Select Filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Select
            isMulti
            options={districts.map((d) => ({ value: d.id, label: d.name }))}
            value={selectedDistricts}
            onChange={setSelectedDistricts}
            placeholder="Search & Select Districts..."
            classNamePrefix="react-select"
          />
        </div>

        {/* Destination Dropdown */}
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm bg-white text-gray-900 text-sm"
          >
            <option value="">All Destinations</option>
            {destinations.map((dest) => (
              <option key={dest.slug} value={dest.slug}>
                {dest.title}
              </option>
            ))}
          </select>
        </div>

        {/* Exam Dropdown */}
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm bg-white text-gray-900 text-sm"
          >
            <option value="">All Exams</option>
            {exams.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* MOE Certification Dropdown */}
        <div className="relative">
          <Award className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={moeCertified}
            onChange={(e) => setMoeCertified(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm bg-white text-gray-900 text-sm"
          >
            <option value="">MOE Certification</option>
            <option value="true">Certified</option>
            <option value="false">Not Certified</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ConsultancyFilters;
