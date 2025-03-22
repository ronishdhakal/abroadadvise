"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Abroad Advise?",
    answer:
      "Abroad Advise is a platform that connects students with trusted consultancies and universities for studying abroad. We help you explore courses, destinations, and application opportunities in one place.",
  },
  {
    question: "Is Abroad Advise free to use for students?",
    answer:
      "Yes, our platform is completely free for students. You can search, inquire, and connect with institutions without any charges.",
  },
  {
    question: "How can I contact a consultancy or university listed on the platform?",
    answer:
      "Each profile has an 'Apply Now' or 'Inquire' button which allows you to directly send your interest or questions to that institution.",
  },
  {
    question: "Can institutions claim or update their profile?",
    answer:
      "Yes. Verified institutions can log in to their dashboard to manage their profile, add events, courses, and respond to inquiries.",
  },
  {
    question: "Which countries can I apply to from Abroad Advise?",
    answer:
      "We don’t process applications ourselves — instead, we connect you with trusted consultancies and universities that help students apply to top study destinations like Australia, Canada, the UK, the USA, and many more. You can explore your options and reach out directly through their verified profiles on our platform.",
  },
  {
    question: "How do I know if a consultancy or university is verified?",
    answer:
      "Verified profiles have a blue checkmark on their listing. These institutions have been reviewed by our admin team for authenticity.",
  },
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-16 w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-12 text-center"
        >
          Frequently Asked Questions
        </motion.h1>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border rounded-xl overflow-hidden shadow-sm"
            >
              <button
                className="w-full flex justify-between items-center p-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggle(index)}
              >
                <span className="font-medium text-gray-900 text-base sm:text-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { height: "auto", opacity: 1 },
                      collapsed: { height: 0, opacity: 0 },
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="px-5 pb-5 text-gray-700 text-sm sm:text-base overflow-hidden"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
