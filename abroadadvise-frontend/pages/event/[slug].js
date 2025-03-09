"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import EventHeader from "./EventHeader";
import EventRegistrationDetail from "./EventRegistrationDetail";
import EventOverview from "./EventOverview";
import EventAbout from "./EventAbout";
import EventOther from "./EventOther";
import InquiryModal from "../../components/InquiryModal"; // ✅ Import Inquiry Modal

export default function EventDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [otherEvents, setOtherEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState({
    entityType: "event",
    entityId: null,
    entityName: "",
  });
  const [isLoading, setIsLoading] = useState(true); // ✅ Added Loading State

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/event/${slug}/`);
        if (!res.ok) throw new Error("Event not found.");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load event details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [router.isReady, slug, API_URL]);

  useEffect(() => {
    fetch(`${API_URL}/event/active/`)
      .then((response) => response.json())
      .then((data) => setOtherEvents(data))
      .catch((err) => console.error("Error fetching other events:", err));
  }, [API_URL]);

  // ✅ Open Inquiry Modal Dynamically
  const openInquiryModal = (entityType, entityId, entityName) => {
    if (!entityType || !entityId) {
      console.error("❌ Missing entityType or entityId:", { entityType, entityId });
      alert("Something went wrong! Missing entity type or ID.");
      return;
    }

    console.log("✅ Opening Inquiry Modal for:", { entityType, entityId, entityName });

    setSelectedEntity({ entityType, entityId, entityName });
    setIsModalOpen(true);
  };

  if (isLoading)
    return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600 font-semibold mt-10">{error}</p>;
  if (!event)
    return <p className="text-center text-gray-600 font-semibold mt-10">Event not found.</p>;

  return (
    <>
      <Head>
        <title>{event.name} - Event</title>
        <meta name="description" content={event.description || "Study abroad event details"} />
      </Head>

      <Header />

      <main className="bg-gray-50 text-black min-h-screen pb-12">
        {/* ✅ Event Header - Fixed Props */}
        <EventHeader
          event={event}
          setIsModalOpen={setIsModalOpen}
          setSelectedEntity={setSelectedEntity}
        />

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ✅ Left Column - Registration & Other Events */}
          <div className="md:col-span-1 space-y-6">
            <EventRegistrationDetail
              event={event}
              setIsModalOpen={setIsModalOpen}
              setSelectedEntity={setSelectedEntity}
            />

            {/* ✅ Other Active Events - Visible only in sidebar on desktop */}
            <div className="hidden lg:block">
              <EventOther otherEvents={otherEvents} />
            </div>
          </div>

          {/* ✅ Right Column - Event Details & Organizer Info */}
          <div className="md:col-span-2 space-y-6">
            {/* ✅ Event Overview Section */}
            <EventOverview event={event} />

            {/* ✅ About Section */}
            <EventAbout event={event} />

            {/* ✅ Other Active Events - Visible below on mobile */}
            <div className="block lg:hidden">
              <EventOther otherEvents={otherEvents} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ✅ Inquiry Modal - Opens on Register Click */}
      {isModalOpen && (
        <InquiryModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          entityType={selectedEntity.entityType}
          entityId={selectedEntity.entityId}
          entityName={selectedEntity.entityName}
          consultancyId={event.organizer?.type === "consultancy" ? event.organizer.id : null}
          consultancyName={event.organizer?.type === "consultancy" ? event.organizer.name : null}
          universityId={event.organizer?.type === "university" ? event.organizer.id : null}
          universityName={event.organizer?.type === "university" ? event.organizer.name : null}
          destinationId={null}
          destinationName={null}
        />
      )}
    </>
  );
}
