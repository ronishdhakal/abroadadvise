"use client";

import Select from "react-select";

const EventFilters = ({
  eventType,
  setEventType,
  registrationType,
  setRegistrationType,
  destination,
  setDestination,
  destinations = [], // ✅ Fallback to empty array to prevent map error
}) => {
  const eventTypeOptions = [
    { value: "", label: "All Types" },
    { value: "physical", label: "Physical" },
    { value: "online", label: "Online" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const registrationOptions = [
    { value: "", label: "All Registrations" },
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
  ];

  const destinationOptions = [
    { value: "", label: "All Destinations" },
    ...(Array.isArray(destinations)
      ? destinations.map((dest) => ({
          value: dest.slug,
          label: dest.title,
        }))
      : []),
  ];

  return (
    <div className="mt-4 bg-white p-6 shadow-lg rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black">Advanced Filters</h2>
        <button
          onClick={() => {
            setEventType("");
            setRegistrationType("");
            setDestination("");
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Event Type Filter */}
        <Select
          options={eventTypeOptions}
          value={eventTypeOptions.find((opt) => opt.value === eventType)}
          onChange={(selected) => setEventType(selected.value)}
          placeholder="All Types"
          classNamePrefix="react-select"
        />

        {/* Registration Type Filter */}
        <Select
          options={registrationOptions}
          value={registrationOptions.find((opt) => opt.value === registrationType)}
          onChange={(selected) => setRegistrationType(selected.value)}
          placeholder="All Registrations"
          classNamePrefix="react-select"
        />

        {/* Destination Filter */}
        <Select
          options={destinationOptions}
          value={destinationOptions.find((opt) => opt.value === destination)}
          onChange={(selected) => setDestination(selected.value)}
          placeholder="All Destinations"
          classNamePrefix="react-select"
        />
      </div>
    </div>
  );
};

export default EventFilters;
