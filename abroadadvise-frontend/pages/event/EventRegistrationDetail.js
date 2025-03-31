"use client";

import { CheckCircle, XCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

const EventRegistrationDetail = ({ event, setIsModalOpen, setSelectedEntity }) => {
  if (!event) return null;

  const [isEventClosed, setIsEventClosed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (event.date) {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setIsEventClosed(eventDate < today);
    }
  }, [event.date]);

  const handleRegistration = () => {
    if (!event) return;

    setSelectedEntity({
      entityType: "event",
      entityId: event.id,
      entityName: event.name,
      organizerId: event.organizer ? event.organizer.id : null,
      organizerName: event.organizer ? event.organizer.name : "Unknown Organizer",
    });

    setIsModalOpen(true);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: `Check out this event: ${event.name}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing event:", error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Registration Details
      </h2>

      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Registration Type:</span>
          <span className="text-gray-800 font-semibold capitalize">
            {event.registration_type === "free" ? "Free" : "Paid"}
          </span>
        </div>

        {event.registration_type === "paid" && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Price:</span>
            <span className="text-gray-800 font-semibold">
              {event.price ? `NPR ${parseFloat(event.price).toFixed(2)}` : "Free"}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Status:</span>
          {isEventClosed ? (
            <span className="inline-flex items-center text-red-600 bg-red-100 px-3 py-1 rounded-full font-medium">
              <XCircle className="h-4 w-4 mr-1" />
              Registration Closed
            </span>
          ) : (
            <span className="inline-flex items-center text-white bg-green-600 px-3 py-1 rounded-full font-medium">
              <CheckCircle className="h-4 w-4 mr-1" />
              Registration Open
            </span>
          )}
        </div>
      </div>

      {!isEventClosed && (
        <button
          onClick={handleRegistration}
          className="mt-6 w-full bg-[#4c9bd5] hover:bg-[#3b87c4] text-white font-semibold py-3 rounded-lg transition-all shadow-sm"
        >
          Register Now
        </button>
      )}

      <button
        onClick={handleShare}
        className="mt-3 w-full border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-lg flex items-center justify-center transition"
      >
        <Share2 className="h-5 w-5 mr-2" />
        {isCopied ? "Copied!" : "Share Event"}
      </button>
    </div>
  );
};

export default EventRegistrationDetail;
