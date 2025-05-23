export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
import axios from "axios";
import { fetchWithAuth } from "./auth"; // Used in authenticated endpoints

/** ✅ Auth Header Helper */
const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
};

/** ✅ Fetch Study Destinations with Pagination & Search */
export const fetchDestinations = async (page = 1, search = "") => {
  try {
    const params = new URLSearchParams({ page });
    if (search) params.append("search", search);

    const url = `${API_BASE_URL}/destination/?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch destinations: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching destinations:", error);
    throw error;
  }
};

/** ✅ Fetch Exams with Pagination and Optional Type Filter */
export const fetchExams = async (page = 1, search = "", type = "") => {
  try {
    const params = new URLSearchParams({ page });
    if (search) params.append("search", search);
    if (type) params.append("type", type);

    const url = `${API_BASE_URL}/exam/?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch exams: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching exams:", error);
    throw error;
  }
};

/** ✅ Fetch Courses with Pagination + Search */
export const fetchCourses = async (page = 1, search = "") => {
  try {
    const params = new URLSearchParams({ page });
    if (search) params.append("search", search);

    const url = `${API_BASE_URL}/course/?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch courses: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    throw error;
  }
};

/** ✅ Fetch Universities with Pagination + Search */
export const fetchUniversities = async (page = 1, search = "") => {
  try {
    const params = new URLSearchParams({ page });
    if (search) params.append("search", search);

    const url = `${API_BASE_URL}/university/?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch universities: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching universities:", error);
    throw error;
  }
};

/** ✅ Fetch All Universities (no pagination) */
export const fetchAllUniversities = async () => {
  try {
    const url = `${API_BASE_URL}/university/?page_size=1000`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch all universities: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching all universities:", error);
    throw error;
  }
};

/** ✅ Fetch University Details by Slug */
export const fetchUniversityDetails = async (slug) => {
  try {
    const url = `${API_BASE_URL}/university/${slug}/`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch university details: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching university details:", error);
    throw error;
  }
};

/** ✅ Fetch Consultancies with Pagination & Search */
export const fetchConsultancies = async (page = 1, search = "") => {
  try {
    const params = new URLSearchParams({ page });
    if (search) params.append("search", search);

    const url = `${API_BASE_URL}/consultancy/?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch consultancies: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching consultancies:", error);
    throw error;
  }
};

/** ✅ Fetch Single Consultancy Details by Slug */
export const fetchConsultancyDetails = async (slug) => {
  try {
    const url = `${API_BASE_URL}/consultancy/${slug}/`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch consultancy details: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching consultancy details:", error);
    throw error;
  }
};

/** ✅ Utility: Convert array-like fields to JSON string in FormData */
const convertToJson = (formData, key) => {
  let value = formData.get(key);
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      value = [];
    }
  }
  if (!Array.isArray(value)) value = [];

  const converted = value
    .map((item) => {
      const parsed = parseInt(item, 10);
      return isNaN(parsed) ? item : parsed;
    })
    .filter((item) => typeof item === "number" || typeof item === "string");

  formData.set(key, JSON.stringify(converted));
};

/** ✅ Create Consultancy */
export const createConsultancy = async (formData) => {
  try {
    // Boolean conversions
    formData.set("moe_certified", formData.get("moe_certified") === "true");
    formData.set("verified", formData.get("verified") === "true");

    // Array fields
    ["districts", "study_abroad_destinations", "test_preparation", "partner_universities"].forEach((key) =>
      convertToJson(formData, key)
    );

    const response = await fetch(`${API_BASE_URL}/consultancy/create/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create consultancy");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating consultancy:", error);
    throw error;
  }
};

/** ✅ Update Consultancy */
export const updateConsultancy = async (slug, formData) => {
  try {
    ["districts", "study_abroad_destinations", "test_preparation", "partner_universities"].forEach((key) =>
      convertToJson(formData, key)
    );

    const response = await fetch(`${API_BASE_URL}/consultancy/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update consultancy");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating consultancy:", error);
    throw error;
  }
};

/** ✅ Delete Consultancy */
export const deleteConsultancy = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/consultancy/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete consultancy");
    }

    return { success: true, message: "✅ Consultancy deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting consultancy:", error);
    throw error;
  }
};


/** ✅ Create University (Handles FormData & File Uploads) */
export const createUniversity = async (formData) => {
  try {
    // ✅ Convert necessary fields to JSON
    convertToJson(formData, "disciplines");
    convertToJson(formData, "faqs");

    const response = await fetch(`${API_BASE_URL}/university/create/`, {
      method: "POST",
      headers: getAuthHeaders(), // Do NOT set Content-Type for FormData
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to create university");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating university:", error);
    throw error;
  }
};

/** ✅ Update University (Handles FormData & File Uploads) */
export const updateUniversity = async (slug, formData) => {
  try {
    convertToJson(formData, "disciplines");
    convertToJson(formData, "faqs");

    const response = await fetch(`${API_BASE_URL}/university/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(), // Do NOT set Content-Type for FormData
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(errorData.detail || "Failed to update university");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating university:", error);
    throw error;
  }
};

/** ✅ Delete University */
export const deleteUniversity = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/university/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete university");
    }

    return { success: true, message: "✅ University deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting university:", error);
    throw error;
  }
};

/** ✅ Fetch Single Course Details */
export const fetchCourseDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/course/${slug}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch course details: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching course details:", error);
    throw error;
  }
};


/** ✅ Create Course (Handles FormData & File Uploads) */
export const createCourse = async (formData) => {
  try {
    // ✅ Remove null/undefined/"null" fields
    for (let [key, value] of formData.entries()) {
      if (value === null || value === "null" || value === undefined) {
        formData.delete(key);
      }
    }

    const response = await fetch(`${API_BASE_URL}/course/create/`, {
      method: "POST",
      headers: getAuthHeaders(), // Do NOT manually set Content-Type
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create course: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating course:", error);
    throw error;
  }
};

/** ✅ Update Course (Handles FormData & File Uploads) */
export const updateCourse = async (slug, formData) => {
  try {
    // ✅ Only send updated files
    if (!formData.get("icon") || !(formData.get("icon") instanceof File)) {
      formData.delete("icon");
    }
    if (!formData.get("cover_image") || !(formData.get("cover_image") instanceof File)) {
      formData.delete("cover_image");
    }

    // ✅ Remove empty fields
    for (let [key, value] of formData.entries()) {
      if (value === null || value === "null" || value === undefined) {
        formData.delete(key);
      }
    }

    const response = await fetch(`${API_BASE_URL}/course/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update course: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating course:", error);
    throw error;
  }
};

/** ✅ Delete Course */
export const deleteCourse = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/course/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete course");
    }

    return { success: true, message: "✅ Course deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    throw error;
  }
};

/** ✅ Fetch Destination Details by Slug */
export const fetchDestinationDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destination/${slug}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch destination details: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching destination details:", error);
    throw error;
  }
};

/**
 * ✅ Prepare FormData for Submission
 * Converts booleans + array-like fields to proper JSON string format
 */
const prepareFormData = (formData) => {
  if (formData.has("moe_certified")) {
    formData.set("moe_certified", formData.get("moe_certified") === "true");
  }

  const jsonFields = ["courses_to_study", "universities", "consultancies"];
  jsonFields.forEach((field) => {
    if (formData.has(field)) {
      let value = formData.get(field);
      try {
        value = typeof value === "string" ? JSON.parse(value) : value;
      } catch {
        // fallback to existing string
      }
      formData.set(field, JSON.stringify(value || []));
    }
  });

  return formData;
};


/** ✅ Create Destination (FormData & Uploads) */
export const createDestination = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destination/create/`, {
      method: "POST",
      headers: getAuthHeaders(), // Do NOT set Content-Type for FormData
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to create destination");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating destination:", error);
    throw error;
  }
};

/** ✅ Update Destination (FormData & Conditional File Handling) */
export const updateDestination = async (slug, formData) => {
  try {
    // Only include files if newly uploaded
    if (!formData.get("country_logo") || !(formData.get("country_logo") instanceof File)) {
      formData.delete("country_logo");
    }
    if (!formData.get("cover_page") || !(formData.get("cover_page") instanceof File)) {
      formData.delete("cover_page");
    }

    const response = await fetch(`${API_BASE_URL}/destination/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to update destination");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating destination:", error);
    throw error;
  }
};

/** ✅ Delete Destination by Slug */
export const deleteDestination = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destination/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete destination");
    }

    return { success: true, message: "✅ Destination deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting destination:", error);
    throw error;
  }
};



/** ✅ Fetch Single Exam by Slug */
export const fetchExamDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/exam/${slug}/`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to fetch exam details");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching exam details:", error);
    throw error;
  }
};

/** ✅ Create Exam (Handles FormData & File Uploads) */
export const createExam = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/exam/create/`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(), // Auth only; no Content-Type
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to create exam");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating exam:", error);
    throw error;
  }
};

/** ✅ Update Exam (Handles FormData & File Uploads) */
export const updateExam = async (slug, formData) => {
  try {
    // ✅ Only include icon if updated
    if (!formData.get("icon") || !(formData.get("icon") instanceof File)) {
      formData.delete("icon");
    }

    const response = await fetch(`${API_BASE_URL}/exam/${slug}/update/`, {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to update exam");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating exam:", error);
    throw error;
  }
};

/** ✅ Delete Exam */
export const deleteExam = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/exam/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete exam");
    }

    return { success: true, message: "✅ Exam deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting exam:", error);
    throw error;
  }
};



// ✅ Fetch Events with Pagination & Search
export const fetchEvents = async (page = 1, search = "") => {
  try {
    const response = await fetch(`${API_BASE_URL}/event/?page=${page}&search=${search}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    throw error;
  }
};

// ✅ Fetch Single Event Details
export const fetchEventDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/event/${slug}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching event details:", error);
    throw error;
  }
};

// ✅ Convert Array of Slugs to JSON String for FormData
const convertToSlugJson = (formData, key) => {
  const values = formData.getAll(key);
  if (values.length > 0) {
    formData.delete(key);
    formData.set(key, JSON.stringify(values));
  }
};

// ✅ Create Event (FormData & Uploads)
export const createEvent = async (formData) => {
  try {
    convertToSlugJson(formData, "targeted_destinations");
    convertToSlugJson(formData, "related_universities");
    convertToSlugJson(formData, "related_consultancies");

    const response = await fetch(`${API_BASE_URL}/event/create/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create event: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating event:", error);
    throw error;
  }
};

// ✅ Update Event (FormData & Uploads)
export const updateEvent = async (slug, formData) => {
  try {
    convertToSlugJson(formData, "targeted_destinations");
    convertToSlugJson(formData, "related_universities");
    convertToSlugJson(formData, "related_consultancies");

    const response = await fetch(`${API_BASE_URL}/event/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update event: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating event:", error);
    throw error;
  }
};

// ✅ Delete Event
export const deleteEvent = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/event/${slug}/delete/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete event");
    }

    return { success: true, message: "✅ Event deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting event:", error);
    throw error;
  }
};

// ✅ Fetch Blog List with Filtering, Pagination, and Search
export const getBlogs = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/blog/`, { params });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    throw error;
  }
};

// ✅ Fetch Single Blog by Slug
export const getBlogBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/blog/${slug}/`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching blog post:", error);
    throw error;
  }
};

// ✅ Create Blog Post (FormData Upload)
export const createBlog = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/create/`, {
      method: "POST",
      headers: getAuthHeaders(), // ✅ Auth only — no manual Content-Type
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to create blog");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    throw error;
  }
};

// ✅ Update Blog Post
export const updateBlog = async (slug, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update blog: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating blog:", error);
    throw error;
  }
};

// ✅ Delete Blog Post
export const deleteBlog = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${slug}/delete/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete blog");
    }

    return { success: true, message: "✅ Blog post deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    throw error;
  }
};

// ✅ Create News Post (FormData Upload)
export const createNews = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/create/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create news: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating news:", error);
    throw error;
  }
};

// ✅ Update News Post
export const updateNews = async (slug, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update news: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating news:", error);
    throw error;
  }
};

// ✅ Delete News Post
export const deleteNews = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/${slug}/delete/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete news");
    }

    return { success: true, message: "✅ News post deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting news:", error);
    throw error;
  }
};

// ✅ Fetch News List (Paginated + Filter)
export const getNewsList = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news/`, { params });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    throw error;
  }
};

// ✅ Fetch News Detail by Slug
export const getNewsBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news/${slug}/`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching news post:", error);
    throw error;
  }
};

// ✅ Fetch All Inquiries (Admin Only)
export const getAllInquiries = async (page = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inquiry/admin/all/?page=${page}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inquiries: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching inquiries:", error);
    throw error;
  }
};

// ✅ Fetch Single Inquiry by ID
export const getInquiryById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inquiry/admin/?${id}/`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching inquiry ${id}:`, error);
    throw error;
  }
};

// ✅ Fetch Consultancy Profile by Token (Used in Auth)
export const fetchConsultancyProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/consultancy-profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching consultancy profile:", error);
    throw error;
  }
};

// ✅ Consultancy Dashboard (GET)
export const fetchConsultancyDashboard = async () => {
  const token = localStorage.getItem("accessToken");
  const consultancyId = localStorage.getItem("consultancy_id");

  if (!token) throw new Error("User not logged in");
  if (!consultancyId) throw new Error("Consultancy ID is missing. Please log in again.");

  try {
    const response = await fetch(`${API_BASE_URL}/consultancy/dashboard/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch consultancy profile");

    const data = await response.json();

    return {
      ...data,
      study_abroad_destinations: Array.isArray(data.study_abroad_destinations)
        ? data.study_abroad_destinations.map((d) => d.id)
        : [],
      test_preparation: Array.isArray(data.test_preparation)
        ? data.test_preparation.map((e) => e.id)
        : [],
      partner_universities: Array.isArray(data.partner_universities)
        ? data.partner_universities.map((u) => u.id)
        : [],
      inquiries: data.inquiries || [],
    };
  } catch (error) {
    console.error("❌ Error fetching consultancy dashboard:", error);
    throw error;
  }
};

// ✅ Update Consultancy Dashboard (PATCH)
export const updateConsultancyDashboard = async (formData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not logged in");

  try {
    const response = await fetch(`${API_BASE_URL}/consultancy/dashboard/update/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update consultancy profile");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating consultancy dashboard:", error);
    throw error;
  }
};



// Fetch Colleges
// ✅ Fetch Colleges with Pagination & Search
export const fetchColleges = async (page = 1, search = "") => {
  try {
    const response = await fetch(`${API_BASE_URL}/college/?page=${page}&search=${search}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch colleges");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching colleges:", error);
    throw error;
  }
};

// ✅ Fetch Single College Details
export const fetchCollegeDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/college/${slug}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch college details");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching college details:", error);
    throw error;
  }
};



// ✅ Create College
export const createCollege = async (formData) => {
  formData.set("moe_certified", formData.get("moe_certified") === "true");
  formData.set("verified", formData.get("verified") === "true");

  ["districts", "study_abroad_destinations", "affiliated_universities"].forEach((key) => {
    convertToJson(formData, key);
  });

  const response = await fetch(`${API_BASE_URL}/college/create/`, {
    method: "POST",
    headers: getAuthHeaders(), // ✅ Auth only, no Content-Type
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Create College API Error:", errorData);
    throw new Error(errorData.error || "Failed to create college");
  }

  return await response.json();
};

// ✅ Update College
export const updateCollege = async (slug, formData) => {
  ["districts", "study_abroad_destinations", "affiliated_universities"].forEach((key) => {
    convertToJson(formData, key);
  });

  const response = await fetch(`${API_BASE_URL}/college/${slug}/update/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Update College API Error:", errorData);
    throw new Error(errorData.error || "Failed to update college");
  }

  return await response.json();
};

// ✅ Delete College
export const deleteCollege = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/college/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Delete College API Error:", errorData);
      throw new Error(errorData.detail || "Failed to delete college");
    }

    return { success: true, message: "✅ College deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting college:", error);
    throw error;
  }
};

// ✅ Fetch College Profile (for login session)
export const fetchCollegeProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/college-profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching college profile:", error);
    throw error;
  }
};

// ✅ Fetch College Dashboard
export const fetchCollegeDashboard = async () => {
  const token = localStorage.getItem("accessToken");
  const collegeId = localStorage.getItem("college_id");

  if (!token) throw new Error("User not logged in");
  if (!collegeId) throw new Error("College ID is missing. Please log in again.");

  const response = await fetch(`${API_BASE_URL}/college/dashboard/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch college profile");

  const data = await response.json();

  return {
    ...data,
    study_abroad_destinations: Array.isArray(data.study_abroad_destinations)
      ? data.study_abroad_destinations.map((d) => d.id)
      : [],
    affiliated_universities: Array.isArray(data.affiliated_universities)
      ? data.affiliated_universities.map((u) => u.id)
      : [],
    inquiries: data.inquiries || [],
  };
};

// ✅ Update College Dashboard (Dashboard PATCH)
export const updateCollegeDashboard = async (updateData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not logged in");

  const jsonFields = ["branches", "districts", "study_abroad_destinations", "affiliated_universities"];
  jsonFields.forEach((key) => {
    if (updateData.has(key)) {
      const val = updateData.get(key);
      if (typeof val !== "string") {
        updateData.set(key, JSON.stringify(val));
      }
    }
  });

  try {
    const response = await fetch(`${API_BASE_URL}/college/dashboard/update/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updateData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ College Dashboard Update API Error:", errorData);
      throw new Error(errorData.error || "Failed to update college profile");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating college dashboard:", error);
    throw error;
  }
};

// ✅ Fetch University Dashboard
export const fetchUniversityDashboard = async () => {
  const token = localStorage.getItem("access_token");
  const universityId = localStorage.getItem("university_id");

  console.log("🔍 Checking university_id in localStorage:", universityId);
  if (!token) throw new Error("User not logged in");
  if (!universityId) throw new Error("University ID is missing. Please log in again.");

  try {
    const response = await fetch(`${API_BASE_URL}/university/dashboard/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ API Error:", error);
      throw new Error(error.detail || "Failed to fetch university dashboard");
    }

    const universityData = await response.json();
    console.log("✅ University Dashboard Data:", universityData);
    return universityData;
  } catch (error) {
    console.error("❌ Fetch University Dashboard Failed:", error);
    throw error;
  }
};

// ✅ Update University Dashboard Profile
export const updateUniversityDashboard = async (updateData) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("User not logged in");

  try {
    const response = await fetch(`${API_BASE_URL}/university/dashboard/update/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updateData,
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      throw new Error("❌ API returned HTML instead of JSON. Possible server error.");
    }

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.detail || "Failed to update university profile");
    }

    console.log("✅ University Update Response:", responseData);
    return responseData;
  } catch (error) {
    console.error("❌ Update University Dashboard Failed:", error);
    throw error;
  }
};

// ✅ Fetch Blog Categories
export const fetchBlogCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/categories/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch blog categories");

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("❌ Error fetching blog categories:", error);
    throw error;
  }
};

// ✅ Create Blog Category
export const createBlogCategory = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/categories/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Create Blog Category Error:", errorData);
      throw new Error(errorData.detail || "Failed to create blog category");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating blog category:", error);
    throw error;
  }
};

// ✅ Update Blog Category
export const updateBlogCategory = async (slug, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/categories/${slug}/update/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Update Blog Category Error:", errorData);
      throw new Error(errorData.detail || "Failed to update blog category");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating blog category:", error);
    throw error;
  }
};


// ✅ Delete Blog Category
export const deleteBlogCategory = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/categories/${slug}/delete/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Delete Blog Category API Error:", errorData);
      throw new Error(errorData.detail || "Failed to delete blog category");
    }

    return { success: true, message: "✅ Blog category deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting blog category:", error);
    throw error;
  }
};

// ✅ Fetch News Categories
export const fetchNewsCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/categories/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch news categories");

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("❌ Error fetching news categories:", error);
    throw error;
  }
};

// ✅ Create News Category
export const createNewsCategory = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/categories/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Create News Category API Error:", errorData);
      throw new Error(errorData.detail || "Failed to create news category");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating news category:", error);
    throw error;
  }
};

// ✅ Update News Category
export const updateNewsCategory = async (slug, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/categories/${slug}/update/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Update News Category API Error:", errorData);
      throw new Error(errorData.detail || "Failed to update news category");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating news category:", error);
    throw error;
  }
};

// ✅ Delete News Category
export const deleteNewsCategory = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/categories/${slug}/delete/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Delete News Category API Error:", errorData);
      throw new Error(errorData.detail || "Failed to delete news category");
    }

    return { success: true, message: "✅ News category deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting news category:", error);
    throw error;
  }
};

// ✅ Fetch Districts (Paginated + Searchable)
export const fetchDistricts = async (page = 1, search = "") => {
  try {
    const url = new URL(`${API_BASE_URL}/districts/`);
    url.searchParams.append("page", page);
    if (search) {
      url.searchParams.append("search", search);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch districts");

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching districts:", error);
    throw error;
  }
};

// ✅ Create District
export const createDistrict = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/districts/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to create district");

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating district:", error);
    throw error;
  }
};

// ✅ Update District
export const updateDistrict = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/districts/${id}/update/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Update District Error:", errorData);
    throw new Error(errorData.detail || "Failed to update district");
  }

  return await response.json();
};

// ✅ Delete District
export const deleteDistrict = async (id) => {
  const response = await fetch(`${API_BASE_URL}/districts/${id}/delete/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Delete District Error:", errorData);
    throw new Error(errorData.detail || "Failed to delete district");
  }

  return { success: true };
};

// ✅ Fetch Disciplines
export const fetchDisciplines = async (page = 1, search = "") => {
  try {
    const url = new URL(`${API_BASE_URL}/disciplines/`);
    url.searchParams.append("page", page);
    if (search) url.searchParams.append("search", search);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch disciplines");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching disciplines:", error);
    throw error;
  }
};

// ✅ Create Discipline
export const createDiscipline = async (data) => {
  const response = await fetch(`${API_BASE_URL}/disciplines/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Create Discipline Error:", errorData);
    throw new Error(errorData.detail || "Failed to create discipline");
  }

  return await response.json();
};

// ✅ Update Discipline
export const updateDiscipline = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/disciplines/${id}/update/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Update Discipline Error:", errorData);
    throw new Error(errorData.detail || "Failed to update discipline");
  }

  return await response.json();
};

// ✅ Delete Discipline
export const deleteDiscipline = async (id) => {
  const response = await fetch(`${API_BASE_URL}/disciplines/${id}/delete/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Delete Discipline Error:", errorData);
    throw new Error(errorData.detail || "Failed to delete discipline");
  }

  return { success: true };
};

// ✅ Fetch Ads
export const fetchAds = async (page = 1, search = "") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ads/admin/?page=${page}&search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch ads: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching ads:", error);
    throw error;
  }
};

// ✅ Create Ad
export const createAd = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/ads/create/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(), // ✅ Don't set Content-Type for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create ad: ${errorText}`);
  }

  return await response.json();
};

// ✅ Update Ad
export const updateAd = async (id, formData) => {
  const response = await fetch(`${API_BASE_URL}/ads/${id}/update/`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(), // ✅ FormData: no Content-Type needed
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update ad: ${errorText}`);
  }

  return await response.json();
};

// ✅ Delete Ad
export const deleteAd = async (id) => {
  const response = await fetch(`${API_BASE_URL}/ads/${id}/delete/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete ad: ${errorText}`);
  }

  return { success: true };
};

// ===================== USERS =====================

// ✅ Fetch Users (Paginated + Searchable)
export const fetchUsers = async (page = 1, search = "") => {
  const queryParams = new URLSearchParams({ page });
  if (search) queryParams.append("search", search);

  const response = await fetch(
    `${API_BASE_URL}/auth/users/?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch users: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

// ✅ Create User
export const createUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/users/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create user");
  }

  return await response.json();
};

// ✅ Update User
export const updateUser = async (userId, updatedData) => {
  const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update user");
  }

  return await response.json();
};

// ✅ Delete User
export const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/delete/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete user");
  }

  return await response.json();
};


// ===================== SCHOLARSHIPS =====================

// ✅ Fetch Scholarships (Paginated + Searchable)
export const fetchScholarships = async (page = 1, search = "") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/scholarship/?page=${page}&search=${search}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch scholarships");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching scholarships:", error);
    throw error;
  }
};

// ✅ Fetch Single Scholarship Details
export const fetchScholarshipDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/scholarship/${slug}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch scholarship details");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching scholarship details:", error);
    throw error;
  }
};

// ✅ Create Scholarship (FormData)
export const createScholarship = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/scholarship/create/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ API Response Error:", errorData);
    throw new Error(errorData.error || "Failed to create scholarship");
  }

  return await response.json();
};

// ✅ Update Scholarship (FormData)
export const updateScholarship = async (slug, formData) => {
  const response = await fetch(`${API_BASE_URL}/scholarship/${slug}/update/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ API Response Error:", errorData);
    throw new Error(errorData.error || "Failed to update scholarship");
  }

  return await response.json();
};

// ✅ Delete Scholarship
export const deleteScholarship = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/scholarship/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Delete Scholarship API Error:", errorData);
      throw new Error(errorData.detail || "Failed to delete scholarship");
    }

    return { success: true, message: "✅ Scholarship deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting scholarship:", error);
    throw error;
  }
};

// =================== DROPDOWN APIS ===================

// ✅ University Dropdown
export const fetchUniversitiesDropdown = async (search = "") => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/university/dropdown/?search=${encodeURIComponent(search)}`
    );
    if (!res.ok) throw new Error("Failed to fetch universities");
    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching university dropdown:", error);
    return [];
  }
};

// ✅ Destination Dropdown
export const fetchDestinationsDropdown = async (search = "") => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/destination/dropdown/?search=${encodeURIComponent(search)}`
    );
    if (!res.ok) throw new Error("Failed to fetch destinations");
    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching destination dropdown:", error);
    return [];
  }
};

// ✅ District Dropdown
export const fetchDistrictsDropdown = async (search = "") => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/district/dropdown/?search=${encodeURIComponent(search)}`
    );
    if (!res.ok) throw new Error("Failed to fetch districts");
    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching district dropdown:", error);
    return [];
  }
};

// ✅ Consultancy Dropdown
export const fetchConsultanciesDropdown = async (search = "") => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/consultancy/dropdown/?search=${encodeURIComponent(search)}`
    );
    if (!res.ok) throw new Error("Failed to fetch consultancies");
    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching consultancy dropdown:", error);
    return [];
  }
};

// =================== FEATURED PAGE ===================

// ✅ List Featured Pages (Paginated + Search)
export const getFeaturedPages = async ({ page = 1, search = "" }) => {
  const res = await fetch(`${API_BASE_URL}/featured/?page=${page}&search=${search}`);
  if (!res.ok) throw new Error("Failed to fetch featured pages");
  return await res.json();
};

// ✅ Get Featured Page by Slug
export const getFeaturedBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/featured/${slug}/`);
  if (!res.ok) throw new Error("Failed to fetch featured detail");
  return await res.json();
};

// ✅ Alias for Get Featured Detail
export const fetchFeaturedDetails = getFeaturedBySlug;

// ✅ Create Featured Page
export const createFeaturedPage = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${API_BASE_URL}/featured/create/`, {
    method: "POST",
    headers: getAuthHeaders(), // ✅ Include JWT only, no Content-Type
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create featured page: ${errorText}`);
  }

  return await res.json();
};

// ✅ Update Featured Page
export const updateFeaturedPage = async (slug, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/featured/${slug}/update/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ API Response Error:", errorData);
    throw new Error(errorData.error || "Failed to update featured page");
  }

  return await response.json();
};

// ✅ Delete Featured Page
export const deleteFeaturedPage = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/featured/${slug}/delete/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Delete Featured Page Error:", errorText);
    throw new Error("Failed to delete featured page");
  }

  return { success: true };
};
