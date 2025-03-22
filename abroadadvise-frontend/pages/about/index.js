"use client";

import { Lightbulb, Globe, GraduationCap, Building2, Users } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AboutPage() {
  const features = [
    {
      icon: Lightbulb,
      title: "What is Abroad Advise?",
      description:
        "Abroad Advise is a student-first platform that connects aspiring international students with verified consultancies and global universities. We provide up-to-date information, course listings, events, and tools to make study abroad decisions easier and more confident.",
    },
    {
      icon: Building2,
      title: "Trusted Consultancies",
      description:
        "We list verified, experienced consultancies with in-depth profiles, helping students connect directly for guidance, application support, and visa processes.",
    },
    {
      icon: GraduationCap,
      title: "Top Universities & Courses",
      description:
        "Students can explore diverse universities and programs with detailed info on eligibility, fees, scholarships, course structure, and future career prospects.",
    },
    {
      icon: Globe,
      title: "Global Study Destinations",
      description:
        "Explore top countries for education with insights on requirements, living costs, documents, and the best universities and consultancies to apply through.",
    },
    {
      icon: Users,
      title: "Built for Students",
      description:
        "Our clean and modern interface is designed for students who want clarity and guidance. We offer leads, real-time updates, filters, and mobile-friendly features."
    },
  ];

  return (
    <>
      <Header />

      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-12"
          >
            About Abroad Advise
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 bg-blue-600 text-white rounded-2xl p-8 text-center shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-2">Empowering the Future of Global Education</h2>
            <p className="text-white/90 text-sm sm:text-base">
              Abroad Advise is more than a directory. We are a digital bridge for thousands of students looking for genuine opportunities. Our mission is to make international education accessible, reliable, and efficient — all from one place.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}