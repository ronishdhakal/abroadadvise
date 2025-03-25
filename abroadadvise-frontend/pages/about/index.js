"use client";

import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { BookOpen, Globe, Users, Building, Star } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Star,
      title: "Our Vision",
      description:
        "Abroad Advise is your gateway to international education, connecting students with verified consultancies and universities. We simplify the journey with clear, reliable information on courses, destinations, and opportunities.",
    },
    {
      icon: Building,
      title: "Trusted Partners",
      description:
        "Discover consultancies you can trust. Our detailed profiles showcase verified experts ready to guide you through applications, visas, and more.",
    },
    {
      icon: BookOpen,
      title: "Explore Education",
      description:
        "Dive into a world of universities and courses, complete with insights on eligibility, costs, scholarships, and career pathways.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "From Australia to the USA, explore top study destinations with tailored advice on living, studying, and succeeding abroad.",
    },
    {
      icon: Users,
      title: "Student-Centric",
      description:
        "Built for you—our sleek, intuitive platform offers real-time updates, smart filters, and a seamless experience on any device.",
    },
  ];

  // Card hover animation variants
  const cardVariants = {
    rest: { scale: 1, y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
      scale: 1.03,
      y: -5,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // Card scroll animation variants
  const scrollVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
        ease: "easeOut",
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    }),
  };

  return (
    <>
      <Header />

      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        <div className="max-w-6xl mx-auto w-full">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl sm:text-5xl font-light text-gray-800 tracking-wide">
              Discover Abroad Advise
            </h1>
            <p className="mt-4 text-gray-600 text-base sm:text-lg font-light tracking-wide max-w-2xl mx-auto">
              Connecting dreams to destinations with elegance and clarity.
            </p>
            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-[#4c9bd5] to-[#3a89c3] rounded-full mx-auto" />
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-sm transition-all duration-300 hover:bg-gray-50"
                >
                  <motion.div
                    variants={scrollVariants}
                    custom={index}
                    className="flex flex-col items-start space-y-4"
                  >
                    <div className="p-3 rounded-full bg-gradient-to-br from-[#4c9bd5] to-[#3a89c3]">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-light text-gray-900 tracking-wide">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-gray-600 text-sm leading-relaxed tracking-wide">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-[#4c9bd5] to-[#3a89c3] text-white rounded-2xl p-8 sm:p-10 text-center shadow-lg"
          >
            <h2 className="text-2xl sm:text-3xl font-light tracking-wide mb-4">
              Shaping the Future of Study Abroad
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed tracking-wide max-w-3xl mx-auto">
              At Abroad Advise, we’re more than a platform—we’re a bridge to your global education dreams. Our mission is to empower students with reliable connections, clear insights, and a seamless experience, all in one beautifully designed space.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}