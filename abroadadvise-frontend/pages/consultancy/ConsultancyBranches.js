"use client";

import { Mail, Phone, MapPin } from "lucide-react";

const ConsultancyBranches = ({ branches }) => {
  if (!branches || branches.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Branches</h2>

      {/* Branches List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <div
            key={branch.id || branch.branch_name}
            className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200"
          >
            {/* Branch Name */}
            <h3 className="text-lg font-semibold text-[#000000] mb-2">{branch.branch_name}</h3>

            {/* Location */}
            {branch.location && (
              <p className="text-gray-700 flex items-start gap-2 text-sm mb-1">
                <MapPin className="h-4 w-4 text-[#4c9bd5] mt-0.5" />
                <span>{branch.location}</span>
              </p>
            )}

            {/* Phone */}
            {branch.phone && (
              <p className="text-gray-700 flex items-start gap-2 text-sm mb-1">
                <Phone className="h-4 w-4 text-[#4c9bd5] mt-0.5" />
                <a href={`tel:${branch.phone}`} className="text-[#000000] hover:underline">
                  {branch.phone}
                </a>
              </p>
            )}

            {/* Email */}
            {branch.email && (
              <p className="text-gray-700 flex items-start gap-2 text-sm">
                <Mail className="h-4 w-4 text-[#4c9bd5] mt-0.5" />
                <a href={`mailto:${branch.email}`} className="text-[#000000] hover:underline break-all">
                  {branch.email}
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultancyBranches;
