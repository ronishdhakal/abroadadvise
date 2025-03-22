"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PenLine, HelpCircle } from "lucide-react";

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
  hover: {
    scale: 1.03,
    transition: { type: "spring", stiffness: 300 },
  },
};

export default function LearnZero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card */}
        <motion.div
          className="bg-blue-600 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-md cursor-pointer"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
        >
          <div className="z-10">
            <motion.h2
              className="text-2xl sm:text-3xl font-bold mb-3 flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Claim Your Business
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg opacity-90 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              To bring your consultancy or university to light with our platform today
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/contact"
                className="inline-block bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition"
              >
                Contact Now
              </Link>
            </motion.div>
          </div>

          {/* Icon Illustration */}
          <motion.div
            className="absolute bottom-4 right-4 opacity-60"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <PenLine className="w-24 h-24 sm:w-28 sm:h-28 text-white" />
          </motion.div>
        </motion.div>

        {/* Right Card */}
        <motion.div
          className="bg-blue-100 text-gray-800 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-md cursor-pointer"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, amount: 0.3 }}
          custom={1}
        >
          <div className="z-10">
            <motion.h2
              className="text-2xl sm:text-3xl font-bold mb-3 flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Have any confusion
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg text-gray-700 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              To bring your consultancy or university to light with our platform today
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/contact"
                className="inline-block bg-blue-900 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-blue-800 transition"
              >
                Contact Now
              </Link>
            </motion.div>
          </div>

          {/* Icon Illustration */}
          <motion.div
            className="absolute bottom-4 right-4 opacity-70"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <HelpCircle className="w-24 h-24 sm:w-28 sm:h-28 text-blue-900" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
