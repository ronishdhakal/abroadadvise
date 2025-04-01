import Link from "next/link";
import { PiBuildings, PiGraduationCap, PiGlobeHemisphereWest, PiBookOpenText } from "react-icons/pi";
import { motion } from "framer-motion";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

const iconVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
};

export default function HeroSection() {
  return (
    <section className="relative bg-[#F5FAFD] py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-800 tracking-tight mb-4"
          >
            Explore Global Education with Us
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-[#4c9bd5] font-light max-w-2xl mx-auto"
          >
            Connect with top consultancies, universities, and courses worldwide.
          </motion.p>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          <CategoryCard
            href="/consultancy"
            icon={<PiBuildings className="w-6 h-6 sm:w-7 h-7 text-[#4c9bd5]" />}
            title="Consultancies"
            description="Expert support"
          />
          <CategoryCard
            href="/university"
            icon={<PiGraduationCap className="w-6 h-6 sm:w-7 h-7 text-[#4c9bd5]" />}
            title="Universities"
            description="Leading schools"
          />
          <CategoryCard
            href="/destination"
            icon={<PiGlobeHemisphereWest className="w-6 h-6 sm:w-7 h-7 text-[#4c9bd5]" />}
            title="Destinations"
            description="Study globally"
          />
          <CategoryCard
            href="/course"
            icon={<PiBookOpenText className="w-6 h-6 sm:w-7 h-7 text-[#4c9bd5]" />}
            title="Courses"
            description="Find your path"
          />
        </motion.div>
      </div>

      {/* Subtle Decorative Element */}
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-[#4c9bd5]/10 rounded-full -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-[#4c9bd5]/10 rounded-full translate-x-1/2 translate-y-1/2"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
}

function CategoryCard({ icon, title, description, href }) {
  return (
    <Link href={href} className="block group">
      <motion.div
        variants={itemVariants}
        whileHover="hover"
        className="bg-white p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      >
        <div className="flex items-center space-x-3 sm:space-x-4">
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            className="p-2 rounded-full bg-[#4c9bd5]/10 group-hover:bg-[#4c9bd5]/15 transition-colors duration-300"
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-[#4c9bd5] transition-colors duration-300">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}