"use client";

import { Globe, Mail, Phone, Calendar, CheckCircle } from "lucide-react";

const ConsultancyContact = ({ consultancy }) => {
  if (!consultancy) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <p className="text-gray-400 italic">Consultancy data not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>

      <div className="space-y-5 text-sm text-gray-800">
        {/* Website */}
        {consultancy.website && (
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-[#4c9bd5]" />
            <div>
              <p className="text-gray-500">Website</p>
              <a
                href={consultancy.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4c9bd5] font-medium hover:underline"
              >
                {consultancy.website}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {consultancy.email && (
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-[#4c9bd5]" />
            <div>
              <p className="text-gray-500">Email</p>
              <a
                href={`mailto:${consultancy.email}`}
                className="text-[#4c9bd5] font-medium hover:underline"
              >
                {consultancy.email}
              </a>
            </div>
          </div>
        )}

        {/* Phone */}
        {consultancy.phone && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-[#4c9bd5]" />
            <div>
              <p className="text-gray-500">Phone</p>
              <a
                href={`tel:${consultancy.phone}`}
                className="text-[#4c9bd5] font-medium hover:underline"
              >
                {consultancy.phone}
              </a>
            </div>
          </div>
        )}

        {/* Establishment Date */}
        {consultancy.establishment_date && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#4c9bd5]" />
            <div>
              <p className="text-gray-500">Established</p>
              <p className="text-gray-800 font-medium">
                {new Date(consultancy.establishment_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {/* MOE Certification */}
        {consultancy.moe_certified && (
          <div className="flex items-center gap-2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg mt-2 text-sm font-medium">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Certified by Ministry of Education</span>
          </div>
        )}

        {/* Districts */}
        {consultancy.districts?.length > 0 && (
          <div>
            <h3 className="text-gray-800 font-semibold mb-2">Districts Covered</h3>
            <div className="flex flex-wrap gap-2">
              {consultancy.districts.map((district) => (
                <span
                  key={district.id}
                  className="bg-[#eaf4fb] text-[#2676a3] px-3 py-1 rounded-md text-sm"
                >
                  {district.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Brochure */}
        {consultancy.brochure && (
          <a
            href={consultancy.brochure}
            download
            className="mt-6 inline-block w-full text-center bg-[#4c9bd5] hover:bg-[#3a8cc1] text-white font-medium py-3 rounded-lg transition-all shadow-sm"
          >
            📄 Download Brochure
          </a>
        )}
      </div>
    </div>
  );
};

export default ConsultancyContact;
