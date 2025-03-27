"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import EventForm from "@/components/admin/EventForm";
import {
  fetchEvents,
  deleteEvent,
  fetchEventDetails,
} from "@/utils/api";
import Pagination from "@/pages/consultancy/Pagination";

const EventsPage = ({ initialEvents, initialTotalPages }) => {
  const [events, setEvents] = useState(initialEvents || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = await fetchEvents(page, search);
      setEvents(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
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

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    const originalEvents = [...events];
    setEvents((prev) => prev.filter((e) => e.slug !== slug));

    try {
      await deleteEvent(slug);
      setSuccessMessage("✅ Event deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete event:", err);
      setError("❌ Failed to delete event.");
      setEvents(originalEvents);
    }
  };

  const handleEdit = async (slug) => {
    setLoading(true);
    setEditingSlug(slug);
    setShowForm(true);

    try {
      const eventData = await fetchEventDetails(slug);
      setEditingData(eventData);
    } catch (err) {
      console.error("❌ Failed to load event details:", err);
      setError("❌ Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSlug(null);
    setEditingData(null);
    setSuccessMessage("✅ Event saved successfully!");
    loadEvents();
  };

  return (
    <AdminLayout>
      <Head>
        <title>Manage Events | Admin Panel</title>
        <meta
          name="description"
          content="Manage events in Abroad Advise admin panel. Add, edit, and delete event records seamlessly."
        />
      </Head>

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Events</h1>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] transition-all"
            />
            <button
              onClick={loadEvents}
              className="bg-[#4c9bd5] text-white px-4 py-3 rounded-lg hover:bg-[#3a8cc4] transition-all"
            >
              Search
            </button>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingSlug(null);
              setEditingData(null);
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              showForm
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-[#4c9bd5] text-white hover:bg-[#3a8cc4]"
            }`}
          >
            {showForm ? "Cancel" : "Add New Event"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
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
          </div>
        )}

        {loading ? (
          <div className="text-center py-6 text-gray-600">Loading events...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-4 text-left font-semibold min-w-[50px]">#</th>
                    <th className="p-4 text-left font-semibold min-w-[200px]">Event Name</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Date</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Type</th>
                    <th className="p-4 text-left font-semibold min-w-[100px]">Featured Image</th>
                    <th className="p-4 text-left font-semibold min-w-[150px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length > 0 ? (
                    events.map((event, index) => (
                      <tr
                        key={event.id}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                      >
                        <td className="p-4 text-gray-600">{index + 1 + (page - 1) * 10}</td>
                        <td className="p-4 text-gray-800">{event.name}</td>
                        <td className="p-4 text-gray-600">{event.date}</td>
                        <td className="p-4 text-gray-600 capitalize">{event.event_type}</td>
                        <td className="p-4">
                          {event.featured_image ? (
                            <img
                              src={event.featured_image}
                              alt="Featured"
                              className="w-16 h-12 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-500">No Image</span>
                          )}
                        </td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(event.slug)}
                            className="bg-[#4c9bd5] text-white px-4 py-2 rounded-lg hover:bg-[#3a8cc4] transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.slug)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-600">
                        No events found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps() {
  try {
    const events = await fetchEvents(1);
    return {
      props: {
        initialEvents: events.results || [],
        initialTotalPages: Math.ceil(events.count / 10) || 1,
      },
    };
  } catch (error) {
    return {
      props: {
        initialEvents: [],
        initialTotalPages: 1,
      },
    };
  }
}

export default EventsPage;