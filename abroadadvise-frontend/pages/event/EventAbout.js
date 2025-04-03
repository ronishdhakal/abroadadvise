"use client";

const EventAbout = ({ event }) => {
  if (!event || !event.description) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6 border">
        <p className="text-gray-400 italic">No description available for this event.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border">
      <div
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: event.description }}
      />
    </div>
  );
};

export default EventAbout;
