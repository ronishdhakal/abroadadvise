import Link from "next/link";
import { PiBuildings, PiGraduationCap, PiGlobeHemisphereWest, PiBookOpenText } from "react-icons/pi";
import { motion } from "framer-motion";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const iconVariants = {
  hover: { scale: 1.2, rotate: 15, transition: { duration: 0.3 } },
  tap: { scale: 0.9, transition: { duration: 0.3 } },
};

const shineVariants = {
  initial: { x: "-100%" },
  hover: { x: "200%", transition: { duration: 0.5 } },
};

export default function HeroSection() {
  return (
    <section className="relative bg-[#F5F7FA] text-[#1A3C5A] py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Subtle Curved Background */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 300C200 150 400 450 720 300C1040 150 1240 450 1440 300V600H0V300Z"
            fill="url(#gradient)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#E0E7FF", stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: "#C7D2FE", stopOpacity: 0.9 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A3C5A]"
          >
            Your Journey to Global Education Starts Here

          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg sm:text-xl lg:text-2xl text-[#4A90E2] font-light max-w-2xl mx-auto"
          >
            Discover universities, courses, and consultancies worldwide. Get
          expert guidance for your international education journey.

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
            icon={<PiBuildings className="w-7 h-7 text-[#4A90E2]" />}
            title="Consultancies"
            description="Expert advisors"
          />
          <CategoryCard
            href="/university"
            icon={<PiGraduationCap className="w-7 h-7 text-[#4A90E2]" />}
            title="Universities"
            description="Top schools"
          />
          <CategoryCard
            href="/destination"
            icon={<PiGlobeHemisphereWest className="w-7 h-7 text-[#4A90E2]" />}
            title="Destinations"
            description="Study abroad"
          />
          <CategoryCard
            href="/course"
            icon={<PiBookOpenText className="w-7 h-7 text-[#4A90E2]" />}
            title="Courses"
            description="Your program"
          />
        </motion.div>
      </div>

      {/* Subtle Decorative Elements */}
      <motion.div
        className="absolute top-10 left-10 w-16 h-16 bg-[#4A90E2]/10 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-24 h-24 bg-[#4A90E2]/10 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
        className="relative bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-[#E0E7FF]/50 hover:shadow-md hover:bg-[#F5F7FA] transition-all duration-300 overflow-hidden"
      >
        {/* Subtle Glow Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#4A90E2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <div className="flex items-center space-x-3">
          {/* Icon with Animation */}
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            className="bg-[#4A90E2]/10 p-3 rounded-full group-hover:bg-[#4A90E2]/20 transition-colors duration-300"
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#1A3C5A] group-hover:text-[#4A90E2] transition-colors duration-300">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280]">{description}</p>
          </div>
        </div>

        {/* Hover Shine Effect */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full bg-white/20 opacity-0 group-hover:opacity-100 transform -skew-x-12"
          variants={shineVariants}
          initial="initial"
          whileHover="hover"
        />
      </motion.div>
    </Link>
  );
}