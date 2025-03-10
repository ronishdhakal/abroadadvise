import Link from "next/link";
import { PiBuildings, PiGraduationCap, PiGlobeHemisphereWest, PiBookOpenText } from "react-icons/pi";

export default function HeroSection() {
  return (
    <section className="bg-[#529dd4] text-white text-center py-10 px-6"> {/* ✅ Updated background color */}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          Your Journey to Global Education Starts Here
        </h1>
        <p className="mt-4 text-lg text-gray-200">
          Discover universities, courses, and consultancies worldwide. Get
          expert guidance for your international education journey.
        </p>
      </div>

      {/* Grid: 4 in a row on desktop, 2 in a row on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-8 px-4">
        <CategoryCard
          href="/consultancy"
          icon={<PiBuildings className="text-blue-600 w-8 h-8" />}
          title="Consultancies"
          description="Find trusted education advisors"
        />
        <CategoryCard
          href="/university"
          icon={<PiGraduationCap className="text-blue-600 w-8 h-8" />}
          title="Universities"
          description="Explore top institutions"
        />
        <CategoryCard
          href="/destination"
          icon={<PiGlobeHemisphereWest className="text-blue-600 w-8 h-8" />}
          title="Destinations"
          description="Choose your study country"
        />
        <CategoryCard
          href="/course"
          icon={<PiBookOpenText className="text-blue-600 w-8 h-8" />}
          title="Courses"
          description="Find your perfect program"
        />
      </div>
    </section>
  );
}

// ✅ Reusable Category Card Component
function CategoryCard({ icon, title, description, href }) {
  return (
    <Link href={href} className="block">
      <div className="flex items-center space-x-3 bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 cursor-pointer w-full">
        <div className="bg-blue-100 p-3 rounded-lg flex items-center justify-center w-14 h-14">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-md font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-xs">{description}</p>
        </div>
      </div>
    </Link>
  );
}
