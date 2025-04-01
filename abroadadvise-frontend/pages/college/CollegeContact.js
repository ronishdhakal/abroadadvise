"use client";

import { Globe, Mail, Phone, Calendar, GraduationCap } from "lucide-react";

const CollegeContact = ({ college }) => {
  if (!college) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <p className="text-gray-400 italic">College data not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>

      <div className="space-y-5 text-sm text-gray-800">
        {/* Website */}
        {college.website && (
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-[#4c9bd5]" />
            <div>
              <p className="text-gray-500">Website</p>
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4c9bd5] font-medium hover:underline"
              >
                {college.website}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {college.email && (
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-[#4c9bd5]" />
            <div>
              <p className="text-gray-500">Email</p>
              <a
                href={`mailto:${college.email}`}
                className="text-[#4c9bd5] font-medium hover:underline"
              >
                {college.email}
              </a>
            </div>
          </div>
        )}

        {/* Phone */}
        {college.phone && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-[#4c9bd5]" />
            <div>
              <p className="text-gray-500">Phone</p>
              <a
                href={`tel:${college.phone}`}
                className="text-[#4c9bd5] font-medium hover:underline"
              >
                {college.phone}
              </a>
            </div>
          </div>
        )}

        {/* Establishment Date */}
        {college.establishment_date && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#4c9bd5]" />
            <div>
              <p className="text-gray-500">Established</p>
              <p className="text-gray-800 font-medium">
                {new Date(college.establishment_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Affiliated Universities */}
        {college.affiliated_universities?.length > 0 && (
          <div>
            <h3 className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#4c9bd5]" />
              Affiliated Universities
            </h3>
            <div className="flex flex-wrap gap-2">
              {college.affiliated_universities.map((uni) => (
                <span
                  key={uni.id}
                  className="bg-[#f0f8ff] text-[#2676a3] px-3 py-1 rounded-md text-sm"
                >
                  {uni.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Brochure */}
        {college.brochure && (
          <a
            href={college.brochure}
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

export default CollegeContact;
