import { Globe, Mail, Phone, Landmark } from "lucide-react";

const UniversityContact = ({ university }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>

      {/* Website */}
      {university.website && (
        <div className="flex items-center text-sm text-gray-700 mb-3">
          <Globe className="h-5 w-5 text-gray-500 mr-2" />
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {university.website}
          </a>
        </div>
      )}

      {/* Email */}
      {university.email && (
        <div className="flex items-center text-sm text-gray-700 mb-3">
          <Mail className="h-5 w-5 text-gray-500 mr-2" />
          <a href={`mailto:${university.email}`} className="text-blue-600 hover:underline">
            {university.email}
          </a>
        </div>
      )}

      {/* Phone */}
      {university.phone && (
        <div className="flex items-center text-sm text-gray-700 mb-3">
          <Phone className="h-5 w-5 text-gray-500 mr-2" />
          <a href={`tel:${university.phone}`} className="text-blue-600 hover:underline">
            {university.phone}
          </a>
        </div>
      )}

      {/* University Type */}
      <div className="flex items-center text-sm text-gray-700 mb-4">
        <Landmark className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-gray-800 font-medium">
          {university.type === "private" ? "Private University" : "Community University"}
        </span>
      </div>

      {/* Verification Badge */}
      {university.verified && (
        <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-md mb-4">
          <span className="font-semibold text-sm">✔ Verified</span>
          <span className="ml-2 text-sm">Verified Institution</span>
        </div>
      )}

      {/* Location & Google Maps */}
      <div>
        <h3 className="text-gray-900 font-medium mb-2">Location</h3>
        <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
          <span>Map preview - {university.name}</span>
        </div>
        {university.map_coordinate && (
          <a
            href={`https://www.google.com/maps?q=${university.map_coordinate}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center mt-4 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            View on Google Maps
          </a>
        )}
      </div>
    </div>
  );
};

export default UniversityContact;
