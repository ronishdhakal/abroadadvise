"use client";

const ConsultancyAbout = ({ consultancy }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900">{`About ${consultancy.name}`}</h2>
      <div
        className="text-gray-800 leading-relaxed mt-2 font-normal"
        dangerouslySetInnerHTML={{ __html: consultancy.about || "No additional details available." }}
      />
    </div>
  );
};

export default ConsultancyAbout;
