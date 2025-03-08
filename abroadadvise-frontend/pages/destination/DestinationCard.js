import Link from "next/link";
import Image from "next/image"; // ✅ Import Next.js Image component
import { Globe } from "lucide-react";

const DestinationCard = ({ destination }) => {
  return (
    <Link href={`/destination/${destination.slug}`} passHref>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-1 p-5 cursor-pointer text-center">
        {/* 🌍 Destination Icon / Country Logo */}
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
          {destination.country_logo ? (
            <Image
              src={destination.country_logo}
              alt={destination.title}
              width={64} // ✅ Set width and height for optimization
              height={64}
              className="rounded-full object-cover"
              unoptimized // Remove if images are from an external source configured in next.config.js
            />
          ) : (
            <Globe className="h-10 w-10 text-gray-400" />
          )}
        </div>

        {/* 🌎 Destination Title */}
        <h2 className="mt-4 text-xl font-semibold text-gray-900">{destination.title}</h2>
      </div>
    </Link>
  );
};

export default DestinationCard;
