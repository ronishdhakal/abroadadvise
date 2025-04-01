"use client";

const HeroSection = () => {
  return (
    <section className="w-full px-4 md:px-0 flex justify-center mt-10">
      <div
        className="bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#009ada] text-white text-center py-16 px-6 md:px-16 
        rounded-2xl shadow-xl w-7xl"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <h1 className="text-3xl md:text-5xl font-extrabold">
          Explore Global Scholarships to Fund Your Dreams
        </h1>
        <p className="text-base md:text-lg mt-3">
          Find scholarships by country and level — and apply with confidence
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
