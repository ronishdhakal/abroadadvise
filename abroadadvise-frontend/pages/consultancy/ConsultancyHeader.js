"use client";

import { MessageSquare, MapPin, BadgeCheck } from "lucide-react";

const ConsultancyHeader = ({ consultancy, setIsModalOpen }) => {
  return (
    <div className="relative w-full h-[300px] md:h-[350px] flex items-center justify-center bg-gray-200 overflow-hidden">
      {/* Cover Photo */}
      {consultancy.cover_photo ? (
        <img
          src={consultancy.cover_photo}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover brightness-[.75]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          No Cover Photo Available
        </div>
      )}

      {/* Dark Gradient Overlay for Better Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>

      {/* Consultancy Info Section */}
      <div className="absolute bottom-6 left-6 md:left-12 flex items-center space-x-4">
        {/* Logo */}
        {consultancy.logo && (
          <img
            src={consultancy.logo}
            alt="Logo"
            className="w-16 h-16 md:w-20 md:h-20 object-contain bg-white p-2 rounded-lg shadow-lg"
          />
        )}

        <div>
          {/* Consultancy Name */}
          <h1 className="text-2xl md:text-4xl text-white font-bold flex items-center">
            {consultancy.name}
            {consultancy.verified && (
              <BadgeCheck className="h-5 w-5 md:h-6 md:w-6 text-green-400 ml-2" />
            )}
          </h1>

          {/* Address */}
          <div className="flex items-center text-gray-300 text-sm md:text-base">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            {consultancy.address}
          </div>
        </div>
      </div>

      {/* Inquire Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute right-6 md:right-12 bottom-6 px-4 md:px-5 py-2 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md flex items-center transition"
      >
        <MessageSquare className="h-4 w-4 md:h-5 md:w-5 mr-2" /> Inquire
      </button>
    </div>
  );
};

export default ConsultancyHeader;
