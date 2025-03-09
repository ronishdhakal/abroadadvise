"use client";

const EventAbout = ({ event }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border">
      {/* Renders HTML Content from TinyMCE (event.description) */}
      <div
        className="text-gray-700 text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: event.description }}
      />
    </div>
  );
};

export default EventAbout;
