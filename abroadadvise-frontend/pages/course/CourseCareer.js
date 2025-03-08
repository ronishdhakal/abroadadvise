"use client";

const CourseCareer = ({ jobProspects }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-5 border">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Career Opportunities</h2>

      {jobProspects ? (
        <div
          className="text-gray-700 text-sm leading-relaxed space-y-2"
          dangerouslySetInnerHTML={{ __html: jobProspects }} // ✅ Ensures list and HTML rendering
        />
      ) : (
        <p className="text-gray-500">Career information not available</p>
      )}
      
      {/* Ensuring proper list styling */}
      <style jsx>{`
        div :global(ul) {
          list-style-type: disc;
          padding-left: 1.25rem; /* Adds indentation */
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        div :global(ol) {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        div :global(li) {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default CourseCareer;
