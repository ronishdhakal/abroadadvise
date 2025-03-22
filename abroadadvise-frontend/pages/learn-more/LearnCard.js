"use client";

import {
  Eye,
  Megaphone,
  BarChart,
  Users,
  Lightbulb,
  MailCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LearnCard() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cards = [
    {
      title: "Highlight visibility to over",
      stat: "1000+",
      subtitle: "students that visit our website daily",
      iconTop: Eye,
      iconBottom: Users,
      bg: "bg-blue-600",
      text: "text-white",
    },
    {
      title: "Build your",
      stat: "Brand",
      subtitle: "as Consultancy or University",
      iconTop: Megaphone,
      iconBottom: Lightbulb,
      bg: "bg-blue-100",
      text: "text-gray-900",
    },
    {
      title: "Increased Applications",
      stat: "48%",
      subtitle: "with better visibility and trust",
      iconTop: BarChart,
      iconBottom: MailCheck,
      bg: "bg-blue-600",
      text: "text-white",
    },
  ];

  return (
    <section className="px-4 sm:px-6 py-20 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cards.map((card, index) => {
          const IconTop = card.iconTop;
          const IconBottom = card.iconBottom;
          const isHovered = hoveredIndex !== null;
          const isThisHovered = hoveredIndex === index;

          return (
            <motion.div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              animate={{
                scale: isHovered ? (isThisHovered ? 1.05 : 0.97) : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.6,
                delay: index * 0.2,
              }}
              className={`rounded-3xl overflow-hidden p-8 flex flex-col justify-between transition-all duration-300 ease-in-out ${card.bg} ${card.text} shadow-xl min-h-[340px]`}
            >
              {/* Top: Title & Icon */}
              <div className="flex justify-between items-start mb-5">
                <h3 className="font-semibold text-lg leading-snug">{card.title}</h3>
                <div
                  className={`p-2 rounded-full ${
                    card.text.includes("white") ? "bg-white/20" : "bg-blue-200"
                  }`}
                >
                  <IconTop
                    className={`w-5 h-5 ${
                      card.text.includes("white") ? "text-white" : "text-blue-800"
                    }`}
                  />
                </div>
              </div>

              {/* Middle: Stat & Description */}
              <div>
                <h2 className="text-5xl font-extrabold mb-2 tracking-tight">{card.stat}</h2>
                <p className="text-sm sm:text-base font-medium opacity-90">
                  {card.subtitle}
                </p>
              </div>

              {/* Bottom Icon */}
              <div className="mt-auto pt-6 flex justify-center">
                <IconBottom
                  className={`w-16 h-16 sm:w-20 sm:h-20 ${
                    card.text.includes("white") ? "text-white/60" : "text-blue-900/60"
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
