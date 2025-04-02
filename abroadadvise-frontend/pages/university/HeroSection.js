const HeroSection = () => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap');
          `,
        }}
      />
      <section className="w-full px-4 md:px-0 flex justify-center mt-10">
        <div
          className="bg-[#4c9bd5] text-white text-center py-12 px-6 md:px-12 
          rounded-xl shadow-lg w-full max-w-6xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Explore Top Universities Worldwide
          </h1>
        </div>
      </section>
    </>
  );
};

export default HeroSection;