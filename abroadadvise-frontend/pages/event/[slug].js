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

// Importing 404 page
import Custom404 from "../404"; // ✅ Import 404 Page

export default function EventDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [event, setEvent] = useState(null);
  const [otherEvents, setOtherEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false); // ✅ Track 404 state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState({
    entityType: "event",
    entityId: null,
    entityName: "",
  });

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/event/${slug}/`);
        if (!res.ok) {
          setIsNotFound(true); // ✅ Mark as 404 instead of throwing an error
          return;
        }

        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setIsNotFound(true); // ✅ Mark as 404 if API call fails
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

  // ✅ Show loading while fetching
  if (isLoading) {
    return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;
  }

  // ✅ Redirect to 404 if event is not found
  if (isNotFound) {
    return <Custom404 />;
  }

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
