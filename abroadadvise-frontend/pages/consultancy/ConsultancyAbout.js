"use client";

const ConsultancyAbout = ({ consultancy }) => {
  const name = consultancy?.name || "this consultancy";
  const aboutHtml = consultancy?.about?.trim();

  return (
    <section
      className="bg-white rounded-lg shadow-md p-6"
      aria-labelledby="about-consultancy-heading"
    >
      <h2
        id="about-consultancy-heading"
        className="text-2xl font-semibold text-gray-900"
      >
        About {name}
      </h2>

      {aboutHtml ? (
        <div
          className="text-gray-800 leading-relaxed mt-4 font-normal prose prose-sm sm:prose lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: aboutHtml }}
        />
      ) : (
        <p className="text-gray-600 mt-2">
          No additional details are available about {name}.
        </p>
      )}
    </section>
  );
};

export default ConsultancyAbout;
