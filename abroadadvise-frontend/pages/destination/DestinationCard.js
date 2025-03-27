import Link from "next/link";
import Image from "next/image";
import { Globe } from "lucide-react";

const DestinationCard = ({ destination }) => {
  if (!destination || !destination.slug) {
    return (
      <div className="bg-gray-100 p-6 rounded-xl shadow text-gray-500 italic text-center">
        Destination data not available.
      </div>
    );
  }

  return (
    <Link href={`/destination/${destination.slug}`} passHref>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-1 p-5 cursor-pointer text-center">
        {/* 🌍 Destination Icon / Country Logo */}
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
          {destination.country_logo ? (
            <Image
              src={destination.country_logo}
              alt={destination.title || "Country"}
              width={64}
              height={64}
              className="rounded-full object-cover"
              unoptimized // Remove this if image domain is configured
            />
          ) : (
            <Globe className="h-10 w-10 text-gray-400" />
          )}
        </div>

        {/* 🌎 Destination Title */}
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          {destination.title || "Unknown Destination"}
        </h2>
      </div>
    </Link>
  );
};

export default DestinationCard;
