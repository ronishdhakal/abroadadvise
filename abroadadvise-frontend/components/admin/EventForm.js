"use client";

import { useState, useEffect } from "react";
import {
  createEvent,
  updateEvent,
  fetchEventDetails,
  fetchDestinations,
  fetchUniversities,
  fetchConsultancies,
} from "@/utils/api";

import EventHeader from "./event/EventHeader";
import EventOverview from "./event/EventOverview";
import EventAbout from "./event/EventAbout";

const EventForm = ({ eventSlug, onSuccess, onCancel }) => {
  const isEditing = !!eventSlug;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    date: "",
    duration: "",
    time: "",
    event_type: "",
    location: "",
    description: "",
    registration_type: "free",
    price: "",
    organizer_slug: "",
    organizer_type: "consultancy",
    targeted_destinations: [],
    related_universities: [],
    related_consultancies: [],
    featured_image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pagination states
  const [allDestinations, setAllDestinations] = useState([]);
  const [allUniversities, setAllUniversities] = useState([]);
  const [allConsultancies, setAllConsultancies] = useState([]);
  const [pageDestinations, setPageDestinations] = useState(1);
  const [pageUniversities, setPageUniversities] = useState(1);
  const [pageConsultancies, setPageConsultancies] = useState(1);
  const [totalPagesDestinations, setTotalPagesDestinations] = useState(1);
  const [totalPagesUniversities, setTotalPagesUniversities] = useState(1);
  const [totalPagesConsultancies, setTotalPagesConsultancies] = useState(1);
  const [searchDestinations, setSearchDestinations] = useState("");
  const [searchUniversities, setSearchUniversities] = useState("");
  const [searchConsultancies, setSearchConsultancies] = useState("");

  // Fetch Event Details if Editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchEventDetails(eventSlug)
        .then((data) => {
          console.log("Fetched Event Data:", data);
          setFormData((prev) => ({
            ...prev,
            ...data,
            targeted_destinations: data.targeted_destinations?.map((d) => d.slug) || [],
            related_universities: data.related_universities?.map((u) => u.slug) || [],
            related_consultancies: data.related_consultancies?.map((c) => c.slug) || [],
            organizer_slug: data.organizer?.slug || "",
            organizer_type: data.organizer?.type || "consultancy",
            featured_image: data.featured_image || prev.featured_image,
          }));
        })
        .catch((err) => {
          console.error("Failed to load event details:", err);
          setError("Failed to load event details");
        })
        .finally(() => setLoading(false));
    }
  }, [eventSlug]);

  // Fetch Paginated Data for Dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destinations, universities, consultancies] = await Promise.all([
          fetchDestinations(pageDestinations, searchDestinations),
          fetchUniversities(pageUniversities, searchUniversities),
          fetchConsultancies(pageConsultancies, searchConsultancies),
        ]);

        setAllDestinations(destinations.results || []);
        setTotalPagesDestinations(Math.ceil(destinations.count / 10));
        setAllUniversities(universities.results || []);
        setTotalPagesUniversities(Math.ceil(universities.count / 10));
        setAllConsultancies(consultancies.results || []);
        setTotalPagesConsultancies(Math.ceil(consultancies.count / 10));
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };
    fetchData();
  }, [
    pageDestinations,
    pageUniversities,
    pageConsultancies,
    searchDestinations,
    searchUniversities,
    searchConsultancies,
  ]);

  // Automatically generate slug if empty
  useEffect(() => {
    if (formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [formData.name]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const submissionData = new FormData();
    console.log("📤 Final FormData before API call:", formData);

    submissionData.append("organizer_slug", formData.organizer_slug);
    submissionData.append("organizer_type", formData.organizer_type);

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "featured_image" && value instanceof File) {
          submissionData.append(key, value);
        } else if (
          key !== "targeted_destinations" &&
          key !== "related_universities" &&
          key !== "related_consultancies"
        ) {
          submissionData.append(key, value);
        }
      }
    });

    formData.targeted_destinations.forEach((slug) => {
      submissionData.append("targeted_destinations", slug);
    });
    formData.related_universities.forEach((slug) => {
      submissionData.append("related_universities", slug);
    });
    formData.related_consultancies.forEach((slug) => {
      submissionData.append("related_consultancies", slug);
    });

    try {
      if (isEditing) {
        await updateEvent(eventSlug, submissionData);
        setSuccess("Event updated successfully!");
      } else {
        await createEvent(submissionData);
        setSuccess("Event created successfully!");
      }
      onSuccess();
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Event" : "Create Event"}</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <EventHeader formData={formData} setFormData={setFormData} />
        <EventOverview
          formData={formData}
          setFormData={setFormData}
          allDestinations={allDestinations}
          allUniversities={allUniversities}
          allConsultancies={allConsultancies}
          pageDestinations={pageDestinations}
          setPageDestinations={setPageDestinations}
          totalPagesDestinations={totalPagesDestinations}
          pageUniversities={pageUniversities}
          setPageUniversities={setPageUniversities}
          totalPagesUniversities={totalPagesUniversities}
          pageConsultancies={pageConsultancies}
          setPageConsultancies={setPageConsultancies}
          totalPagesConsultancies={totalPagesConsultancies}
          searchDestinations={searchDestinations}
          setSearchDestinations={setSearchDestinations}
          searchUniversities={searchUniversities}
          setSearchUniversities={setSearchUniversities}
          searchConsultancies={searchConsultancies}
          setSearchConsultancies={setSearchConsultancies}
        />
        <EventAbout formData={formData} setFormData={setFormData} />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-600 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;