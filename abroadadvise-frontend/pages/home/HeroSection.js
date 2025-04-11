"use client"

import Link from "next/link"
import {
  PiBuildings,
  PiGraduationCap,
  PiGlobeHemisphereWest,
  PiBookOpenText,
} from "react-icons/pi"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="bg-white py-8 md:py-12"> {/* ⬅️ Reduced from py-16 md:py-24 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-3">
            Explore Global Education with Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with top consultancies, universities, and courses worldwide.
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <CategoryCard
            href="/consultancy"
            icon={<PiBuildings />}
            title="Consultancies"
            description="Expert guidance for your educational journey"
          />
          <CategoryCard
            href="/university"
            icon={<PiGraduationCap />}
            title="Universities"
            description="Discover leading educational institutions"
          />
          <CategoryCard
            href="/destination"
            icon={<PiGlobeHemisphereWest />}
            title="Destinations"
            description="Explore global study opportunities"
          />
          <CategoryCard
            href="/course"
            icon={<PiBookOpenText />}
            title="Courses"
            description="Find the perfect program for your goals"
          />
        </motion.div>
      </div>
    </section>
  )
}

function CategoryCard({ icon, title, description, href }) {
  return (
    <Link href={href} className="block h-full">
      <motion.div
        whileHover={{
          y: -4,
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
        }}
        transition={{ duration: 0.2 }}
        className="h-full bg-gray-50 border border-gray-100 rounded-lg p-6 transition-all"
      >
        <div className="flex flex-col items-start">
          <div className="text-[#4c9bd5] mb-4 text-2xl">{icon}</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </motion.div>
    </Link>
  )
}
