import Link from "next/link";
import { Calendar, Clock, MapPin, DollarSign, XCircle } from "lucide-react";

const EventCard = ({ event }) => {
  if (!event) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);

  const isEventClosed = eventDate < today;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden">
      <Link href={`/event/${event.slug}`} passHref>
        <div>
          {/* Event Image */}
          <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
            {event.featured_image ? (
              <img
                src={event.featured_image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Image Available</span>
            )}

            {/* Event Type Badge */}
            <div className="absolute top-2 left-2 bg-[#4c9bd5] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
            </div>

            {/* Registration Type */}
            {!isEventClosed && event.registration_type === "paid" && event.price && (
              <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                <DollarSign className="inline-block w-3 h-3 mr-1" />
                NPR {event.price}
              </div>
            )}
            {!isEventClosed && event.registration_type === "free" && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Free
              </div>
            )}

            {/* Closed Badge */}
            {isEventClosed && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center">
                <XCircle className="inline-block w-3 h-3 mr-1" />
                Closed
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900">{event.name}</h2>

            <div className="flex items-center text-gray-600 text-sm mt-2">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            {event.time && (
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                {event.time}
              </div>
            )}

            {event.location && (
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                {event.location}
              </div>
            )}

            {event.organizer?.name && (
              <p className="text-gray-600 text-sm mt-1">
                <span className="font-semibold">By</span> {event.organizer.name}
              </p>
            )}

            <div className="mt-4">
              <button
                className={`w-full font-medium py-2 rounded-lg transition ${
                  isEventClosed
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#4c9bd5] hover:bg-[#3b87c4] text-white"
                }`}
                disabled={isEventClosed}
              >
                {isEventClosed ? "Event Closed" : "View Details"}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
