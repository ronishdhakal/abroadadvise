"use client";

import { Globe, Mail, Phone, Calendar, CheckCircle } from "lucide-react";

const ConsultancyContact = ({ consultancy }) => {
  if (!consultancy) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <p className="text-gray-400 italic">Consultancy data not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>

      {/* Website */}
      {consultancy.website ? (
        <div className="flex items-center space-x-3 mb-3">
          <Globe className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-gray-500 text-sm">Website</p>
            <a
              href={consultancy.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              {consultancy.website}
            </a>
          </div>
        </div>
      ) : null}

      {/* Email */}
      {consultancy.email ? (
        <div className="flex items-center space-x-3 mb-3">
          <Mail className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <a href={`mailto:${consultancy.email}`} className="text-blue-600 font-medium hover:underline">
              {consultancy.email}
            </a>
          </div>
        </div>
      ) : null}

      {/* Phone */}
      {consultancy.phone ? (
        <div className="flex items-center space-x-3 mb-3">
          <Phone className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <a href={`tel:${consultancy.phone}`} className="text-blue-600 font-medium hover:underline">
              {consultancy.phone}
            </a>
          </div>
        </div>
      ) : null}

      {/* Established Date */}
      {consultancy.establishment_date ? (
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-gray-500 text-sm">Established</p>
            <p className="text-gray-900 font-medium">
              {new Date(consultancy.establishment_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      ) : null}

      {/* Ministry Certification */}
      {consultancy.moe_certified ? (
        <div className="mt-4 flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 border border-green-500">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          <span>Certified Ministry of Education</span>
        </div>
      ) : null}

      {/* Districts Covered */}
      {consultancy.districts?.length > 0 ? (
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
      ) : null}

      {/* Download Brochure */}
      {consultancy.brochure ? (
        <a
          href={consultancy.brochure}
          download
          className="mt-6 flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition shadow-md"
        >
          📄 Download Brochure
        </a>
      ) : null}
    </div>
  );
};

export default ConsultancyContact;
