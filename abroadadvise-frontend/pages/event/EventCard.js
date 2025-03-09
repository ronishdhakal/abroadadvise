import Link from "next/link";
import { Calendar, Clock, MapPin, DollarSign, XCircle } from "lucide-react";

const EventCard = ({ event }) => {
  if (!event) return null;

  // Get today's date without the time part
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Convert event date to a Date object
  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);

  // Check if the event is in the past
  const isEventClosed = eventDate < today;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden">
      <Link href={`/event/${event.slug}`} passHref>
        <div>
          {/* Event Image or Placeholder */}
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
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-md">
              {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
            </div>

            {/* Price Badge */}
            {event.registration_type === "paid" && event.price && (
              <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md">
                <DollarSign className="inline-block w-3 h-3 mr-1" />
                NPR {event.price}
              </div>
            )}
            {event.registration_type === "free" && (
              <div className="absolute top-2 right-2 bg-green-400 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md">
                Free
              </div>
            )}

            {/* Event Closed Badge (If past event) */}
            {isEventClosed && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md">
                <XCircle className="inline-block w-3 h-3 mr-1" />
                Closed
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900">{event.name}</h2>

            {/* Date */}
            <div className="flex items-center text-gray-600 text-sm mt-2">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            {/* Time */}
            {event.time && (
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                {event.time}
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                {event.location}
              </div>
            )}

            {/* Organizer */}
            {event.organizer?.name && (
              <p className="text-gray-600 text-sm mt-1">
                <span className="font-semibold">By</span> {event.organizer.name}
              </p>
            )}

            {/* View Details Button */}
            <div className="mt-4">
              <button
                className={`w-full font-medium py-2 rounded-lg transition ${
                  isEventClosed
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
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
