"use client";

import { Globe, Mail, Phone, Calendar } from "lucide-react";

const ConsultancyContact = ({ consultancy }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>

      {/* Website */}
      {consultancy.website && (
        <p className="flex items-center space-x-2 text-gray-700">
          <Globe className="h-5 w-5 text-gray-500" />
          <a href={consultancy.website} target="_blank" className="text-blue-600 font-medium hover:underline">
            {consultancy.website}
          </a>
        </p>
      )}

      {/* Email */}
      {consultancy.email && (
        <p className="flex items-center space-x-2 text-gray-700 mt-2">
          <Mail className="h-5 w-5 text-gray-500" />
          <a href={`mailto:${consultancy.email}`} className="text-blue-600 font-medium hover:underline">
            {consultancy.email}
          </a>
        </p>
      )}

      {/* Phone */}
      {consultancy.phone && (
        <p className="flex items-center space-x-2 text-gray-700 mt-2">
          <Phone className="h-5 w-5 text-gray-500" />
          <a href={`tel:${consultancy.phone}`} className="text-blue-600 font-medium hover:underline">
            {consultancy.phone}
          </a>
        </p>
      )}

      {/* Established Date */}
      {consultancy.establishment_date && (
        <p className="flex items-center space-x-2 text-gray-700 mt-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span>
            <strong>Established:</strong> {new Date(consultancy.establishment_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
      )}

      {/* Ministry Certification */}
      {consultancy.moe_certified && (
        <div className="mt-4 flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 border border-green-500">
          ✅ <span className="ml-2">Ministry of Education Certified</span>
        </div>
      )}

      {/* Districts Covered */}
      {consultancy.districts?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-gray-800 font-medium">Districts Covered</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {consultancy.districts.map((district) => (
              <span key={district.id} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md">
                {district.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Download Brochure */}
      {consultancy.brochure && (
        <a
          href={consultancy.brochure}
          download
          className="mt-6 flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition shadow-md"
        >
          📄 Download Brochure
        </a>
      )}
    </div>
  );
};

export default ConsultancyContact;
