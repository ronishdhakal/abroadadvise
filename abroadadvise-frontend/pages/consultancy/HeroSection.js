"use client";

import Head from "next/head";

const HeroSection = () => {
  return (
    <>
      {/* ✅ Move font import to <Head> */}
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* ✅ Semantic & Accessible Section */}
      <section
        className="w-full px-4 md:px-0 flex justify-center mt-10"
        aria-labelledby="consultancy-hero-heading"
      >
        <div
          className="bg-[#4c9bd5] text-white text-center py-12 px-6 md:px-12 rounded-xl shadow-lg w-full max-w-6xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <h1
            id="consultancy-hero-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight"
          >
            Find Your Educational Consultancy
          </h1>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
