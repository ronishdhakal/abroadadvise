import Link from "next/link";
import { Award, MapPin } from "lucide-react";

const ConsultancyCard = ({ consultancy }) => {
  return (
    <Link href={`/consultancy/${consultancy.slug}`} passHref>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-1 p-5 cursor-pointer">
        <div className="relative">
          {/* 🏆 MOE Certified Badge */}
          {consultancy.moe_certified && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center shadow-md">
              <Award className="h-3 w-3 mr-1" />
              MOE Certified
            </div>
          )}

          {/* 🖼 Consultancy Logo / Image */}
          <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            {consultancy.logo ? (
              <img
                src={consultancy.logo}
                alt={consultancy.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400">No Image Available</span>
            )}
          </div>

          {/* 🏢 Consultancy Name */}
          <h2 className="mt-4 text-xl font-semibold text-center text-gray-900">{consultancy.name}</h2>

          {/* 📍 Address */}
          <p className="text-gray-600 text-center mt-2 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
            {consultancy.address}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ConsultancyCard;
