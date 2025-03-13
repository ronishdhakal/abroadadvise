"use client";

import { useEffect, useState } from "react";
import Head from "next/head"; // ✅ SEO Optimization
import AdminLayout from "@/components/admin/AdminLayout";
import EventForm from "@/components/admin/EventForm";
import { 
  fetchEvents, 
  deleteEvent, 
  fetchEventDetails 
} from "@/utils/api";

const EventsPage = ({ initialEvents }) => {
  const [events, setEvents] = useState(initialEvents || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch events dynamically when page or search query changes
  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await fetchEvents(page, search);
      console.log("✅ Fetched Events Data:", data.results);
      setEvents(data.results || []);
    } catch (err) {
      console.error("❌ Failed to load events:", err);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page, search]);

  // ✅ Handle Delete Event
  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    // Optimistic UI update
    const originalEvents = [...events];
    setEvents((prev) => prev.filter((e) => e.slug !== slug));

    try {
      await deleteEvent(slug);
      setSuccessMessage("✅ Event deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete event:", err);
      setError("❌ Failed to delete event.");
      setEvents(originalEvents); // Revert UI on failure
    }
  };

  // ✅ Handle Edit Event (Pre-fill Form)
  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);

    try {
      const eventData = await fetchEventDetails(slug);
      console.log("✅ Editing Event:", eventData);
      setEditingData(eventData); // Fill in data for editing
    } catch (err) {
      console.error("❌ Failed to load event details:", err);
      setError("❌ Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Successful Create/Update
  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ Event saved successfully!");
    loadEvents();
  };

  return (
    <AdminLayout>
      {/* ✅ SEO Optimization */}
      <Head>
        <title>Manage Events | Admin Panel</title>
        <meta name="description" content="Manage events in Abroad Advise admin panel. Add, edit, and delete event records seamlessly." />
      </Head>

      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>

      {/* ✅ Success Message */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* ✅ Search Functionality */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />
        <button onClick={loadEvents} className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {/* ✅ Toggle Form for Create/Edit */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingSlug(null);
          setEditingData(null);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Cancel" : "Add New Event"}
      </button>

      {/* ✅ Event Form */}
      {showForm && (
        <EventForm
          eventSlug={editingSlug}
          eventData={editingData}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingSlug(null);
            setEditingData(null);
          }}
        />
      )}

      {/* ✅ Error Handling */}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Loading State */}
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Event Name</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Featured Image</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event, index) => (
                <tr key={event.id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{event.name}</td>
                  <td className="border p-2">{event.date}</td>
                  <td className="border p-2 capitalize">{event.event_type}</td>
                  <td className="border p-2">
                    {event.featured_image ? (
                      <img
                        src={event.featured_image}
                        alt="Featured"
                        className="w-16 h-12 object-cover"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(event.slug)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(event.slug)} className="bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

// ✅ Server-Side Rendering
export async function getServerSideProps() {
  try {
    const events = await fetchEvents();
    return { props: { initialEvents: events.results || [] } };
  } catch (error) {
    return { props: { initialEvents: [] } };
  }
}

export default EventsPage;
