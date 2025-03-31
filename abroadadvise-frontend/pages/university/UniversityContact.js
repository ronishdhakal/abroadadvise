"use client";

import { Globe, Mail, Phone, Landmark, CheckCircle } from "lucide-react";

const UniversityContact = ({ university }) => {
  if (!university || typeof university !== "object") return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md mx-auto border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Contact Information</h2>

      {/* Website */}
      {university.website && (
        <div className="text-sm text-gray-700 mb-4">
          <div className="flex items-center mb-1">
            <Globe className="h-5 w-5 text-[#4c9bd5] mr-2" />
            <span className="font-medium text-gray-700">Website</span>
          </div>
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4c9bd5] hover:underline block ml-7 break-all"
          >
            {university.website}
          </a>
        </div>
      )}

      {/* Email */}
      {university.email && (
        <div className="text-sm text-gray-700 mb-4">
          <div className="flex items-center mb-1">
            <Mail className="h-5 w-5 text-[#4c9bd5] mr-2" />
            <span className="font-medium text-gray-700">Email</span>
          </div>
          <a
            href={`mailto:${university.email}`}
            className="text-[#4c9bd5] hover:underline block ml-7 break-all"
          >
            {university.email}
          </a>
        </div>
      )}

      {/* Phone */}
      {university.phone && (
        <div className="text-sm text-gray-700 mb-4">
          <div className="flex items-center mb-1">
            <Phone className="h-5 w-5 text-[#4c9bd5] mr-2" />
            <span className="font-medium text-gray-700">Phone</span>
          </div>
          <a
            href={`tel:${university.phone}`}
            className="text-[#4c9bd5] hover:underline block ml-7"
          >
            {university.phone}
          </a>
        </div>
      )}

      {/* Type */}
      {university.type && (
        <div className="text-sm text-gray-700 mb-4">
          <div className="flex items-center mb-1">
            <Landmark className="h-5 w-5 text-[#4c9bd5] mr-2" />
            <span className="font-medium text-gray-700">Type</span>
          </div>
          <span className="block ml-7 font-medium text-gray-800">
            {university.type === "private" ? "Private University" : "Community University"}
          </span>
        </div>
      )}

      {/* Verified */}
      {university.verified && (
        <div className="flex items-center bg-[#e6f7f1] text-[#178d5c] px-4 py-2 rounded-md mt-4 border border-[#b6e2ce]">
          <CheckCircle className="h-5 w-5 text-[#178d5c] mr-2" />
          <span className="font-semibold text-sm">Verified Institution</span>
        </div>
      )}
    </div>
  );
};

export default UniversityContact;
