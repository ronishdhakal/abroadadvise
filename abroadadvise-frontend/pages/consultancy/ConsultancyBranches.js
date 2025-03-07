"use client";

import { Mail, Phone, MapPin } from "lucide-react";

const ConsultancyBranches = ({ branches }) => {
  if (!branches || branches.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Branches</h2>

      {/* Branches Grid */}
      <div className="space-y-4">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            {/* Branch Name */}
            <h3 className="text-lg font-semibold">{branch.branch_name}</h3>

            {/* Location */}
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              {branch.location}
            </p>

            {/* Phone */}
            {branch.phone && (
              <p className="text-gray-600 flex items-center mt-1">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <a href={`tel:${branch.phone}`} className="text-blue-600 hover:underline">
                  {branch.phone}
                </a>
              </p>
            )}

            {/* Email */}
            {branch.email && (
              <p className="text-gray-600 flex items-center mt-1">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <a href={`mailto:${branch.email}`} className="text-blue-600 hover:underline">
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
