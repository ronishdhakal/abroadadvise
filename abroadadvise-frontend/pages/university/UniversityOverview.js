import { Globe } from "lucide-react";

const UniversityOverview = ({ university }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200">
      {/* Left Section: University Type & Tuition Fees */}
      <div className="flex flex-wrap items-center gap-3 text-gray-700">
        {/* University Type Badge */}
        <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
          {university.type === "private" ? "Private University" : "Community University"}
        </span>

        {/* Tuition Fees */}
        {university.tuition_fees && (
          <span className="text-sm sm:text-base text-gray-600">
            Tuition: {university.tuition_fees} per year
          </span>
        )}
      </div>

      {/* Right Section: Website & Brochure */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Website Link */}
        {university.website && (
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:underline text-sm sm:text-base"
          >
            <Globe className="h-4 w-4 mr-1" />
            Visit Website
          </a>
        )}

        {/* Download Brochure Button */}
        {university.brochure && (
          <a
            href={university.brochure}
            download
            className="px-4 py-2 text-sm sm:text-base font-semibold text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Download Brochure
          </a>
        )}
      </div>
    </div>
  );
};

export default UniversityOverview;
