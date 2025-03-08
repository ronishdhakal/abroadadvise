import { Globe, Mail, Phone, Landmark, CheckCircle } from "lucide-react";

const UniversityContact = ({ university }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md mx-auto border border-gray-200"> {/* Adjusted width and border */}
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Contact Information</h2>

      {/* Website */}
      {university.website && (
        <div className="text-sm text-gray-700 mb-4">
          <div className="flex items-center mb-1">
            <Globe className="h-5 w-5 text-gray-500 mr-2" />
            <span className="font-medium text-gray-600">Website</span>
          </div>
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline block ml-7"
          >
            {university.website}
          </a>
        </div>
      )}

      {/* Email */}
      {university.email && (
        <div className="text-sm text-gray-700 mb-4">
          <div className="flex items-center mb-1">
            <Mail className="h-5 w-5 text-gray-500 mr-2" />
            <span className="font-medium text-gray-600">Email</span>
          </div>
          <a href={`mailto:${university.email}`} className="text-blue-600 hover:underline block ml-7">
            {university.email}
          </a>
        </div>
      )}

      {/* Phone */}
      {university.phone && (
        <div className="text-sm text-gray-700 mb-4">
          <div className="flex items-center mb-1">
            <Phone className="h-5 w-5 text-gray-500 mr-2" />
            <span className="font-medium text-gray-600">Phone</span>
          </div>
          <a href={`tel:${university.phone}`} className="text-blue-600 hover:underline block ml-7">
            {university.phone}
          </a>
        </div>
      )}

      {/* University Type */}
      <div className="text-sm text-gray-700 mb-4">
        <div className="flex items-center mb-1">
          <Landmark className="h-5 w-5 text-gray-500 mr-2" />
          <span className="font-medium text-gray-600">Type</span>
        </div>
        <span className="block ml-7 font-medium text-gray-800">
          {university.type === "private" ? "Private University" : "Community University"}
        </span>
      </div>

      {/* Verification Badge */}
      {university.verified && (
        <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-md">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="font-semibold text-sm">Verified Institution</span>
        </div>
      )}
    </div>
  );
};

export default UniversityContact;
