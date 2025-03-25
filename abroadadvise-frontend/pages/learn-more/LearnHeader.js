"use client";

import {
  PlaneTakeoff,
  Landmark,
  Globe2,
  Handshake,
} from "lucide-react";

export default function LearnHeader() {
  return (
    <section className="bg-[#f8f9fb] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* Left: Headline & Description */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] font-semibold leading-tight text-gray-900 tracking-tight">
            Showcase Your Consultancy and University <br className="hidden md:block" />
            to Thousands of Aspiring Students
          </h1>
          <p className="mt-4 text-gray-600 text-[15px] sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            Join our platform to reach motivated students exploring their educational future.
            Inspire the next generation with your opportunities.
          </p>
        </div>

        {/* Right: Feature Cards */}
        <div className="lg:w-1/2 grid grid-cols-2 gap-4 sm:gap-5">
          {[
            { icon: PlaneTakeoff, label: "Study Abroad" },
            { icon: Landmark, label: "Top Institutions" },
            { icon: Globe2, label: "Destinations Info" },
            { icon: Handshake, label: "Trusted Partnerships" },
          ].map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 p-4 sm:p-5 rounded-xl flex flex-col items-center text-center hover:shadow-sm transition"
            >
              <Icon className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-800">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
