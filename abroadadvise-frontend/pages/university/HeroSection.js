const HeroSection = () => {
    return (
      <section className="w-full px-4 md:px-0 flex justify-center mt-10">
        <div
          className="bg-gradient-to-r from-[#009ada] to-blue-700 text-white text-center py-16 px-6 md:px-16 
          rounded-2xl shadow-xl w-7xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Explore Top Universities Worldwide
          </h1>
          <p className="text-base md:text-lg mt-3">
            Find the best universities that match your academic and career goals.
          </p>
        </div>
      </section>
    );
  };
  
  export default HeroSection;
  