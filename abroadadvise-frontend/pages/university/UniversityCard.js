import Link from "next/link";
import { MapPin } from "lucide-react";

const UniversityCard = ({ university }) => {
  return (
    <Link href={`/university/${university.slug}`} passHref>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-1 p-5 cursor-pointer">
        <div className="relative">
          {/* 🖼 University Logo / Image */}
          <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            {university.logo ? (
              <img
                src={university.logo}
                alt={university.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400">No Image Available</span>
            )}
          </div>

          {/* 🎓 University Name */}
          <h2 className="mt-4 text-xl font-semibold text-center text-gray-900">
            {university.name}
          </h2>

          {/* 📍 Country Location */}
          <p className="text-gray-600 text-center mt-2 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
            {university.country}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default UniversityCard;
