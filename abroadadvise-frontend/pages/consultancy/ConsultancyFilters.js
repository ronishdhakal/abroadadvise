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
      </div>
    </div>
  );
};

export default ConsultancyFilters;
