"use client";

const ConsultancyServices = ({ consultancy }) => {
  if (!consultancy || !consultancy.services) return null;

  return (
    <section
      className="bg-white rounded-lg shadow-lg p-6"
      aria-labelledby="consultancy-services-heading"
    >
      <h2
        id="consultancy-services-heading"
        className="text-xl font-semibold mb-4 text-gray-900"
      >
        Our Services
      </h2>

      <div
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{
          __html: consultancy.services || "<p>No service information provided.</p>",
        }}
      />
    </section>
  );
};

export default ConsultancyServices;
