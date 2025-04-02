export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"; // Fallback in case env is missing
import axios from "axios";
import { fetchWithAuth } from "./auth"; // ✅ Import fetchWithAuth




    // ✅ Helper Function: Get Auth Headers
    const getAuthHeaders = () => {
    if (typeof window !== "undefined") {  // ✅ Ensure running in browser
        const token = localStorage.getItem("access_token"); // updated code
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {}; // ✅ Return empty headers on server-side
    };





// ✅ Fetch Study Destinations with Pagination and Search
export const fetchDestinations = async (page = 1, search = "") => {
  try {
    const params = new URLSearchParams({ page }); // Add page parameter
    if (search) params.append("search", search);

    const url = `${API_BASE_URL}/destination/?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch study destinations");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching destinations:", error);
    throw error;
  }
};




// ✅ Fetch Exams with Pagination and Filtering Support
export const fetchExams = async (page = 1, search = "", type = "") => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("page", page);
    if (search) queryParams.append("search", search); // ✅ DRF uses `search` param
    if (type) queryParams.append("type", type);

    const url = `${API_BASE_URL}/exam/?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch exams: ${response.status} - ${errorText}`);
    }

    return await response.json(); // ✅ Returns { count, results, ... }
  } catch (error) {
    console.error("❌ Error fetching exams:", error);
    throw error;
  }
};

// Fetch Courses with Pagination + Search
export const fetchCourses = async (page = 1, search = "") => {
  try {
    const pageNumber = Number(page) || 1;

    const queryParams = new URLSearchParams({ page: pageNumber });

    if (search) {
      queryParams.append("search", search); // ✅ Use 'search' for DRF search filter
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/course/?${queryParams.toString()}`;
    console.log("🔍 Fetching courses from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch courses: ${errorMessage}`);
    }

    return await response.json(); // ✅ Returns { count, next, previous, results }
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    throw error;
  }
};



// ✅ Fetch Universities (With Pagination & Search)
export const fetchUniversities = async (page = 1, search = "") => {
  try {
    const response = await fetch(`${API_BASE_URL}/university/?page=${page}&search=${search}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch universities");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching universities:", error);
    throw error;
  }
};

// ✅ Fetch all universities without pagination
export const fetchAllUniversities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/university/?page_size=1000`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch universities");
    }

    return await response.json(); // should return { results: [...] }
  } catch (error) {
    console.error("Error fetching all universities:", error);
    throw error;
  }
};


// ✅ Fetch Single University Details
export const fetchUniversityDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/university/${slug}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch university details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching university details:", error);
    throw error;
  }
};

// ✅ Fetch Consultancies with Pagination & Search
export const fetchConsultancies = async (page = 1, search = "") => {
  try {
    const response = await fetch(`${API_BASE_URL}/consultancy/?page=${page}&search=${search}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch consultancies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching consultancies:", error);
    throw error;
  }
};

// ✅ Fetch Single Consultancy Details
export const fetchConsultancyDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/consultancy/${slug}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch consultancy details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching consultancy details:", error);
    throw error;
  }
};



// ✅ Utility function to ensure proper JSON conversion for arrays
const convertToJson = (formData, key) => {
  let value = formData.get(key);

  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      value = [];
    }
  }

  if (!Array.isArray(value)) {
    value = [];
  }

  // Check if we're dealing with disciplines (This is the university-specific fix)
  if (key === "disciplines") {
    // ✅ Convert values to integers, filter NaN values, and convert to string
    const intArray = value.map(Number).filter((id) => !isNaN(id));
    formData.set(key, JSON.stringify(intArray)); // Store as JSON string in FormData
  } else {
    // ✅ Existing logic for other fields (e.g., districts, study_abroad_destinations)
    // Convert values to integers or keep them as they are, filter NaN values, and convert to string
    const convertedArray = value
      .map((item) => {
        if (typeof item === "string") {
          const parsedItem = parseInt(item, 10);
          return isNaN(parsedItem) ? item : parsedItem;
        } else {
          return item;
        }
      })
      .filter((item) => typeof item === "number" || typeof item === "string");
    formData.set(key, JSON.stringify(convertedArray));
  }
};




// ✅ Create Consultancy
// ✅ Create Consultancy
export const createConsultancy = async (formData) => {
  // ✅ Convert boolean fields correctly
  formData.set("moe_certified", formData.get("moe_certified") === "true");
  formData.set("verified", formData.get("verified") === "true"); // Corrected line

  // ✅ Convert JSON fields before sending
  ["districts", "study_abroad_destinations", "test_preparation", "partner_universities"].forEach((key) => {
      convertToJson(formData, key);
  });

  const response = await fetch(`${API_BASE_URL}/consultancy/create/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
  });

  if (!response.ok) {
      const errorData = await response.json();
      console.error("API Response Error:", errorData);
      throw new Error(errorData.error || "Failed to create consultancy");
  }

  return await response.json();
};



// ✅ Update Consultancy
export const updateConsultancy = async (slug, formData) => {
  // ✅ Convert JSON fields before sending
  ["districts", "study_abroad_destinations", "test_preparation", "partner_universities"].forEach((key) => {
      convertToJson(formData, key);
  });

  const response = await fetch(`${API_BASE_URL}/consultancy/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: formData,
  });

  if (!response.ok) {
      const errorData = await response.json();
      console.error("API Response Error:", errorData);
      throw new Error(errorData.error || "Failed to update consultancy");
  }

  return await response.json();
};


// ✅ Delete Consultancy
export const deleteConsultancy = async (slug) => {
try {
  const response = await fetch(`${API_BASE_URL}/consultancy/${slug}/delete/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // ✅ JSON request
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Delete Consultancy API Error:", errorData);

    throw new Error(errorData.detail || "Failed to delete consultancy");
  }

  return { success: true, message: "✅ Consultancy deleted successfully!" };
} catch (error) {
  console.error("❌ Error deleting consultancy:", error);
  throw error;
}
};



// ✅ Utility function to ensure proper JSON conversion
// const convertToJson = (formData, key) => {
//   let value = formData.get(key);
//   if (typeof value === "string") {
//     try {
//       value = JSON.parse(value);
//     } catch {
//       value = [];
//     }
//   }
//   if (!Array.isArray(value)) {
//     value = [];
//   }
//   const convertedArray = value.map((item) => {
//     if (typeof item === "string") {
//       const parsedItem = parseInt(item, 10);
//       return isNaN(parsedItem) ? item : parsedItem;
//     } else {
//       return item;
//     }
//   }).filter((item) => typeof item === 'number' || typeof item === 'string');

//   formData.set(key, JSON.stringify(convertedArray));
// };

// ... (Other API functions - I'm omitting those that are not related to the university to avoid redundancy)

// ✅ Create University (Handles FormData & File Uploads)
export const createUniversity = async (formData) => {
  try {
    console.log("📤 Submitting University FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // ✅ Ensure disciplines are converted to JSON
    convertToJson(formData, "disciplines");

    // Ensure that faqs are properly converted.
    convertToJson(formData, "faqs");

    const response = await fetch(`${API_BASE_URL}/university/create/`, {
      method: "POST",
      headers: getAuthHeaders(), // ⚠️ Do NOT set "Content-Type" for FormData
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Create University API Error:", errorData);
      throw new Error(JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating university:", error);
    throw error;
  }
};


// ✅ Update University (Handles FormData & File Uploads)
// ✅ Update University (Handles FormData & File Uploads)
export const updateUniversity = async (slug, formData) => {
  try {
    console.log("📤 Updating University FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // ✅ Ensure disciplines are converted to JSON
    convertToJson(formData, "disciplines");

    // Ensure that faqs are properly converted.
    convertToJson(formData, "faqs");

    const response = await fetch(
      `${API_BASE_URL}/university/${slug}/update/`,
      {
        method: "PATCH",
        headers: getAuthHeaders(), // ⚠️ Do NOT set "Content-Type" for FormData
        body: formData,
      }
    );

    // ✅ Logging the full response object
    console.log("Response:", response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Failed to parse JSON error" })); // Attempt to parse error JSON, even if it fails
      console.error("❌ Update University API Error:");
      console.error("Status:", response.status); // Log status code
      console.error("Headers:", response.headers); // Log headers
      console.error("Error Data:", errorData); // Log error data
      throw new Error(errorData.detail || "Failed to update university");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating university:", error);
    throw error;
  }
};
//... rest of the code is same





// ✅ Delete University
export const deleteUniversity = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/university/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // ✅ JSON request
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Delete University API Error:", errorData);

      throw new Error(errorData.detail || "Failed to delete university");
    }

    return { success: true, message: "✅ University deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting university:", error);
    throw error;
  }
};


// ✅ Fetch Single Course Details
export const fetchCourseDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/course/${slug}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching course details:", error);
    throw error;
  }
};

// ... (other imports and code) ...
// ✅ Create Course (Handles FormData & File Uploads)
export const createCourse = async (formData) => {
  try {
    // ✅ Remove empty fields to prevent API errors
    for (let [key, value] of formData.entries()) {
      if (value === null || value === "null" || value === undefined) {
        formData.delete(key);
      }
    }

    const response = await fetchWithAuth(`${API_BASE_URL}/course/create/`, {
      method: "POST",
      headers: getAuthHeaders(), // ✅ No "Content-Type" needed for FormData
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text(); // ✅ Get response text to debug
      console.error("❌ Create Course API Error:", errorData);
      throw new Error(errorData);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating course:", error);
    throw error;
  }
};

// ✅ Update Course (Handles FormData & File Uploads)
export const updateCourse = async (slug, formData) => {
  try {
    // ✅ Ensure we only send new files
    if (!formData.get("icon") || !(formData.get("icon") instanceof File)) {
      formData.delete("icon");
    }
    if (!formData.get("cover_image") || !(formData.get("cover_image") instanceof File)) {
      formData.delete("cover_image");
    }
    // ✅ Remove empty fields to prevent API errors
    for (let [key, value] of formData.entries()) {
      if (value === null || value === "null" || value === undefined) {
        formData.delete(key);
      }
    }

    const response = await fetchWithAuth(`${API_BASE_URL}/course/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(), // ⚠️ Do NOT manually set "Content-Type"
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Debug raw response
      console.error("❌ Update Course API Error:", errorText);
      throw new Error(errorText);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating course:", error);
    throw error;
  }
};
// ... (rest of the code) ...



// ✅ Delete Course
export const deleteCourse = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/course/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // ✅ JSON request
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Delete Course API Error:", errorData);

      throw new Error(errorData.detail || "Failed to delete course");
    }

    return { success: true, message: "✅ Course deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    throw error;
  }
};

// Destination

/**
 * ✅ Fetch Single Destination Details
 * @param {string} slug - Destination slug
 * @returns {Promise} - API response
 */
export const fetchDestinationDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/destination/${slug}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch destination details");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching destination details:", error);
    throw error;
  }
};

/**
 * ✅ Formats FormData before sending (Handles JSON conversion & boolean values)
 * @param {FormData} formData - The form data object
 * @returns {FormData} - FormData with properly formatted values
 */
const prepareFormData = (formData) => {
  // ✅ Convert boolean values to "true" or "false" (String format)
  if (formData.has("moe_certified")) {
    formData.set("moe_certified", formData.get("moe_certified") === "true");
  }

  // ✅ Convert JSON fields to strings before sending (For related courses, universities, consultancies)
  const jsonFields = ["courses_to_study", "universities", "consultancies"];
  jsonFields.forEach((field) => {
    if (formData.has(field)) {
      let value = formData.get(field);
      if (typeof value === "string") {
        try {
          value = JSON.parse(value); // Ensure it's an array
        } catch (e) {
          console.warn(`⚠️ Skipping JSON parse for ${field}: Already a valid string.`);
        }
      }
      formData.set(field, JSON.stringify(value || [])); // Store as JSON string
    }
  });

  return formData;
};

/**
 * ✅ Create a New Destination (Handles FormData & File Uploads)
 * @param {FormData} formData - New Destination data
 * @returns {Promise} - API response
 */
export const createDestination = async (formData) => {
  try {
    console.log("📤 Sending Destination FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]); // ✅ Logs all form data values
    }

    const response = await fetch(`${API_BASE_URL}/destination/create/`, {
      method: "POST",
      headers: getAuthHeaders(), // ✅ Include Auth Headers if needed
      body: formData, // ✅ No "Content-Type" needed (auto-set for FormData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Create Destination API Error:", errorData);
      throw new Error(errorData.detail || "Failed to create destination");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating destination:", error);
    throw error;
  }
};


/**
 * ✅ Update an Existing Destination (Handles FormData & File Uploads)
 * @param {string} slug - Destination slug
 * @param {FormData} formData - Updated Destination data
 * @returns {Promise} - API response
 */
export const updateDestination = async (slug, formData) => {
  try {
    console.log("📤 Updating Destination FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // ✅ Only send files if they are changed
    if (!formData.get("country_logo")) {
      formData.delete("country_logo");
    }
    if (!formData.get("cover_page")) {
      formData.delete("cover_page");
    }

    const response = await fetch(`${API_BASE_URL}/destination/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(), // ✅ No need for "Content-Type" for FormData
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Update Destination API Error:", errorData);
      throw new Error(errorData.detail || "Failed to update destination");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating destination:", error);
    throw error;
  }
};


/**
 * ✅ Delete a Destination
 * @param {string} slug - Destination slug
 * @returns {Promise} - API response
 */
export const deleteDestination = async (slug) => {
  try {
    console.log(`🗑️ Deleting Destination: ${slug}`);

    const response = await fetch(`${API_BASE_URL}/destination/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(), // ✅ Include authentication if needed
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Delete Destination API Error:", errorData);
      throw new Error(errorData.detail || "Failed to delete destination");
    }

    console.log("✅ Destination deleted successfully!");
    return { success: true, message: "✅ Destination deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting destination:", error);
    throw error;
  }
};


/**
 * ✅ Fetch Single Exam by Slug (Detail Page)
 * @param {string} slug - Exam slug
 * @returns {Promise} - API response
 */
export const fetchExamDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/exam/${slug}/`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Get Exam API Error:", errorData);
      throw new Error(errorData.detail || "Failed to fetch exam details");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching exam details:", error);
    throw error;
  }
};

/**
 * ✅ Create a New Exam (Handles FormData & File Uploads)
 * @param {FormData} formData - New Exam data
 * @returns {Promise} - API response
 */
export const createExam = async (formData) => {
  try {
    console.log("📤 Creating Exam with FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]); // ✅ Logs all form data values
    }

    const response = await fetch(`${API_BASE_URL}/exam/create/`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(), // ✅ Include authentication if needed
        "Accept": "application/json", // ✅ Accept JSON response
      },
      body: formData, // ✅ Do NOT set "Content-Type", it is auto-set for FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Create Exam API Error:", errorData);
      throw new Error(errorData.detail || "Failed to create exam");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating exam:", error);
    throw error;
  }
};

/**
 * ✅ Update an Existing Exam (Handles FormData & File Uploads)
 * @param {string} slug - Exam slug
 * @param {FormData} formData - Updated Exam data
 * @returns {Promise} - API response
 */
export const updateExam = async (slug, formData) => {
  try {
    console.log("📤 Updating Exam with FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // ✅ Ensure we do not send empty fields (avoids overwriting with null)
    if (!formData.get("icon")) {
      formData.delete("icon");
    }

    const response = await fetch(`${API_BASE_URL}/exam/${slug}/update/`, {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(), // ✅ Include authentication if needed
        "Accept": "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Update Exam API Error:", errorData);
      throw new Error(errorData.detail || "Failed to update exam");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating exam:", error);
    throw error;
  }
};

/**
 * ✅ Delete an Exam
 * @param {string} slug - Exam slug
 * @returns {Promise} - API response
 */
export const deleteExam = async (slug) => {
  try {
    console.log(`🗑️ Deleting Exam: ${slug}`);

    const response = await fetch(`${API_BASE_URL}/exam/${slug}/delete/`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(), // ✅ Include authentication if needed
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Delete Exam API Error:", errorData);
      throw new Error(errorData.detail || "Failed to delete exam");
    }

    console.log("✅ Exam deleted successfully!");
    return { success: true, message: "✅ Exam deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting exam:", error);
    throw error;
  }
};



// Event

/**
 * ✅ Fetch Events with Pagination & Search
 * @param {number} page - Page number for pagination
 * @param {string} search - Search query for event names
 * @returns {Promise} - API response
 */
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

/**
* ✅ Fetch Single Event Details
* @param {string} slug - Event slug
* @returns {Promise} - Event details
*/
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

// utils/api.js
// ... (rest of your api.js file, including API_BASE_URL, getAuthHeaders, etc.) ...

/**
 * ✅ Convert Array of Slugs to JSON String for FormData
 * @param {FormData} formData
 * @param {string} key - The field name to convert (e.g., "targeted_destinations")
 */
const convertToSlugJson = (formData, key) => {
  const values = formData.getAll(key); // Get all values for the key
  if (values.length > 0) {
      formData.delete(key); // Remove all existing entries for the key
      formData.set(key, JSON.stringify(values)); // Add the JSON string as a single entry
  }
};

/**
 * ✅ Create Event (Handles FormData & File Uploads)
 * @param {FormData} formData - Event data
 * @returns {Promise} - API response
 */
// ✅ Create Event
export const createEvent = async (formData) => {
  try {
    console.log("📤 Sending Event FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    convertToSlugJson(formData, "targeted_destinations");
    convertToSlugJson(formData, "related_universities");
    convertToSlugJson(formData, "related_consultancies");

    const response = await fetch(`${API_BASE_URL}/event/create/`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeaders().Authorization, // ✅ Only auth, no Content-Type
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Create Event API Error:", errorText);
      throw new Error(errorText || "Failed to create event");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating event:", error);
    throw error;
  }
};

// ✅ Update Event
export const updateEvent = async (slug, formData) => {
  try {
    console.log("📤 Updating Event FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    convertToSlugJson(formData, "targeted_destinations");
    convertToSlugJson(formData, "related_universities");
    convertToSlugJson(formData, "related_consultancies");

    const response = await fetch(`${API_BASE_URL}/event/${slug}/update/`, {
      method: "PATCH",
      headers: {
        Authorization: getAuthHeaders().Authorization, // ✅ No Content-Type!
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Update Event API Error:", errorText);
      throw new Error(errorText || "Failed to update event");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating event:", error);
    throw error;
  }
};
// ... (rest of your api.js file) ...


/**
 * ✅ Delete Event
 * @param {string} slug - Event slug
 * @returns {Promise} - API response
 */
export const deleteEvent = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/event/${slug}/delete/`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ✅ Keep authentication headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Delete Event API Error:", errorData);
      throw new Error(errorData.detail || "Failed to delete event");
    }

    return { success: true, message: "✅ Event deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting event:", error);
    throw error;
  }
};

// ... (rest of your api.js file) ...



/**
 * ✅ Fetch Blog List with Filtering, Pagination, and Search
 * @param {Object} params - Optional filters (e.g., { search: "study", category: "scholarships" })
 * @returns {Promise} - API response
 */
export const getBlogs = async (params = {}) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/blog/`, { params });
      return response.data;
  } catch (error) {
      console.error("❌ Error fetching blogs:", error);
      throw error;
  }
};

/**
* ✅ Fetch Single Blog by Slug
* @param {string} slug - Blog post slug
* @returns {Promise} - API response
*/
export const getBlogBySlug = async (slug) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/blog/${slug}/`);
      return response.data;
  } catch (error) {
      console.error("❌ Error fetching blog post:", error);
      throw error;
  }
};

// utils/api.js
// ... (rest of your api.js file, including API_BASE_URL, getAuthHeaders, etc.) ...

/**
 * ✅ Create Blog Post (Handles FormData & File Uploads)
 * @param {FormData} formData - Blog post form data (title, content, image, etc.)
 * @returns {Promise} - API response
 */
export const createBlog = async (formData) => {
  try {
    console.log("📤 Sending Blog FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    const response = await fetch(`${API_BASE_URL}/blog/create/`, {
      method: "POST",
      headers: getAuthHeaders(), // ✅ Include authentication headers
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Create Blog API Error:", errorData);
      throw new Error(errorData.detail || "Failed to create blog");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    throw error;
  }
};

/**
 * ✅ Update Blog Post (Handles FormData & File Uploads)
 * @param {string} slug - Blog post slug
 * @param {FormData} formData - Updated blog post data
 * @returns {Promise} - API response
 */
export const updateBlog = async (slug, formData) => {
  try {
    console.log("📤 Updating Blog FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // ✅ Corrected API endpoint (Ensure slug placement is correct)
    const response = await fetch(`${API_BASE_URL}/blog/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(), // ✅ Include authentication headers
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text(); // ✅ Capture error response
      console.error("❌ Update Blog API Error:", errorText);
      throw new Error(`Failed to update blog: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating blog:", error);
    throw error;
  }
};

/**
 * ✅ Delete Blog Post (Ensures image deletion)
 * @param {string} slug - Blog post slug
 * @returns {Promise} - API response
 */
export const deleteBlog = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${slug}/delete/`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ✅ Include authentication headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Delete Blog API Error:", errorData);
      throw new Error(errorData.detail || "Failed to delete blog");
    }

    return { success: true, message: "✅ Blog post deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    throw error;
  }
};


// News
// utils/api.js

// ... (rest of your api.js file, including API_BASE_URL, getAuthHeaders, etc.) ...

// News
/**
 * ✅ Create News (Handles FormData & File Uploads)
 * @param {FormData} formData - News form data (title, detail, image, etc.)
 * @returns {Promise} - API response
 */
export const createNews = async (formData) => {
  try {
    console.log("📤 Sending News FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    const response = await fetch(`${API_BASE_URL}/news/create/`, {
      method: "POST",
      headers: getAuthHeaders(), // ✅ Include authentication headers
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text(); // ✅ Capture error as text
      console.error("❌ Create News API Error:", errorText);
      throw new Error(`Failed to create news: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating news:", error);
    throw error;
  }
};

/**
 * ✅ Update News (Handles FormData & File Uploads)
 * @param {string} slug - News post slug
 * @param {FormData} formData - Updated news post data
 * @returns {Promise} - API response
 */
export const updateNews = async (slug, formData) => {
  try {
    console.log("📤 Updating News FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // ✅ Corrected API endpoint (Ensure slug placement is correct)
    const response = await fetch(`${API_BASE_URL}/news/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(),// ✅ Include authentication headers
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text(); // ✅ Capture error response
      console.error("❌ Update News API Error:", errorText);
      throw new Error(`Failed to update news: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating news:", error);
    throw error;
  }
};

/**
 * ✅ Delete News Post (Ensures image deletion)
 * @param {string} slug - News post slug
 * @returns {Promise} - API response
 */
export const deleteNews = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/${slug}/delete/`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ✅ Include authentication headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Delete News API Error:", errorData);
      throw new Error(errorData.detail || "Failed to delete news");
    }

    return { success: true, message: "✅ News post deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting news:", error);
    throw error;
  }
};

// ... (rest of your api.js file) ...


/**
 * ✅ Fetch News List with Filtering, Pagination, and Search
 * @param {Object} params - Optional filters (e.g., { search: "scholarships", category: "education" })
 * @returns {Promise} - API response
 */
export const getNewsList = async (params = {}) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/news/`, { params });
      return response.data;
  } catch (error) {
      console.error("❌ Error fetching news:", error);
      throw error;
  }
};

/**
 * ✅ Fetch Single News by Slug
 * @param {string} slug - News post slug
 * @returns {Promise} - API response
 */
export const getNewsBySlug = async (slug) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/news/${slug}/`);
      return response.data;
  } catch (error) {
      console.error("❌ Error fetching news post:", error);
      throw error;
  }
};






/**
 * ✅ Fetch all inquiries with pagination
 * @param {number} page - Current page number
 */
import { getAuthToken } from "./auth";
// ...

// ✅ Fetch ALL Inquiries (No authentication)
export const getAllInquiries = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/inquiry/admin/all/`, {
          headers: getAuthHeaders(),// ✅ Add the headers
      });
      if (!response.ok) {
          throw new Error(`Failed to fetch inquiries: ${response.status}`);
      }
      const data = await response.json();
      console.log("🟢 Inquiries Fetched:", data);
      return data; // ✅ Return ALL inquiries
  } catch (err) {
      console.error("❌ Error fetching inquiries:", err);
      throw err;
  }
};

/**
* ✅ Fetch a single inquiry by ID
* @param {number} id - Inquiry ID
* @returns {Promise} - Inquiry details
*/
export const getInquiryById = async (id) => {
  try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inquiry/admin/?${id}/`);
      return response.data;
  } catch (error) {
      console.error(`❌ Error fetching inquiry ${id}:`, error);
      throw error;
  }
};


// For Profile

export const fetchConsultancyProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/consultancy-profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching consultancy profile:", error);
    throw error;
  }
};

// For Constulancy Dashboard

export const fetchConsultancyDashboard = async () => {
  const token = localStorage.getItem("accessToken");
  const consultancyId = localStorage.getItem("consultancy_id");

  console.log("🔍 Checking consultancy_id in localStorage:", consultancyId); // 🔥 Debugging

  if (!token) {
    throw new Error("User not logged in");
  }
  if (!consultancyId) {
    throw new Error("Consultancy ID is missing. Please log in again.");
  }

  // ✅ Fetch consultancy profile
  const consultancyResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/consultancy/dashboard/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!consultancyResponse.ok) {
    throw new Error("Failed to fetch consultancy profile");
  }

  let consultancyData = await consultancyResponse.json();

  // ✅ Normalize empty fields to avoid undefined issues
  consultancyData = {
    ...consultancyData,
    study_abroad_destinations:
      Array.isArray(consultancyData.study_abroad_destinations) &&
      consultancyData.study_abroad_destinations.length > 0
        ? consultancyData.study_abroad_destinations.map((dest) => dest.id)
        : [],

    test_preparation:
      Array.isArray(consultancyData.test_preparation) &&
      consultancyData.test_preparation.length > 0
        ? consultancyData.test_preparation.map((exam) => exam.id)
        : [],

    partner_universities:
      Array.isArray(consultancyData.partner_universities) &&
      consultancyData.partner_universities.length > 0
        ? consultancyData.partner_universities.map((uni) => uni.id)
        : [],

    inquiries: consultancyData.inquiries || [], // Ensure it's an array
  };

  console.log("✅ Final Consultancy Dashboard Data:", consultancyData);

  return consultancyData;
};


export const updateConsultancyDashboard = async (updateData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not logged in");
  }

  try {
    // ✅ Debugging: Log FormData before sending
    console.log("📤 Sending FormData to API:");
    for (let [key, value] of updateData.entries()) {
      console.log(`🔹 ${key}:`, value);
    }

    const response = await fetch(`${API_BASE_URL}/consultancy/dashboard/update/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updateData, // ✅ Only send relevant fields
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Response Error:", errorData); // ✅ Log exact error response
      throw new Error(errorData.error || "Failed to update consultancy profile");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Update Failed:", error);
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

  // ✅ Convert JSON fields before sending
  ["districts", "study_abroad_destinations", "affiliated_universities"].forEach((key) => {
    convertToJson(formData, key);
  });

  const response = await fetch(`${API_BASE_URL}/college/create/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Response Error:", errorData);
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
    console.error("API Response Error:", errorData);
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

// ✅ Fetch College Profile (used by Auth page)
export const fetchCollegeProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/college-profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching college profile:", error);
    throw error;
  }
};

// ✅ College Dashboard
export const fetchCollegeDashboard = async () => {
  const token = localStorage.getItem("accessToken");
  const collegeId = localStorage.getItem("college_id");

  console.log("🔍 Checking college_id in localStorage:", collegeId);

  if (!token) throw new Error("User not logged in");
  if (!collegeId) throw new Error("College ID is missing. Please log in again.");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/college/dashboard/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch college profile");

  let data = await response.json();

  data = {
    ...data,
    study_abroad_destinations: Array.isArray(data.study_abroad_destinations)
      ? data.study_abroad_destinations.map((d) => d.id)
      : [],
    affiliated_universities: Array.isArray(data.affiliated_universities)
      ? data.affiliated_universities.map((u) => u.id)
      : [],
    inquiries: data.inquiries || [],
  };

  console.log("✅ Final College Dashboard Data:", data);
  return data;
};

// ✅ Update College Profile (Dashboard)
export const updateCollegeDashboard = async (updateData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not logged in");

  // ✅ Manually fix: stringifying arrays for Django
  const safeFields = ["branches", "districts", "study_abroad_destinations", "affiliated_universities"];
  safeFields.forEach((key) => {
    if (updateData.has(key)) {
      const val = updateData.get(key);
      if (typeof val !== "string") {
        updateData.set(key, JSON.stringify(val));
      }
    }
  });

  try {
    console.log("📤 Sending FormData to API:");
    for (let [key, value] of updateData.entries()) {
      console.log(`🔹 ${key}:`, value);
    }

    const response = await fetch(`${API_BASE_URL}/college/dashboard/update/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updateData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Response Error:", errorData);
      throw new Error(errorData.error || "Failed to update college profile");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Update Failed:", error);
    throw error;
  }
};



// ✅ Fetch University Dashboard
export const fetchUniversityDashboard = async () => {
  const token = localStorage.getItem("access_token"); // ✅ Ensure consistency
  const universityId = localStorage.getItem("university_id");

  console.log("🔍 Checking university_id in localStorage:", universityId);

  if (!token) throw new Error("User not logged in");
  if (!universityId) throw new Error("University ID is missing. Please log in again.");

  try {
    const universityResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/university/dashboard/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!universityResponse.ok) {
      const errorResponse = await universityResponse.json();
      console.error("❌ API Error Response:", errorResponse);
      throw new Error(errorResponse.error || "Failed to fetch university profile");
    }

    let universityData = await universityResponse.json();
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
  if (!token) {
    throw new Error("User not logged in");
  }

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/university/dashboard/update/`;
    console.log("📤 Sending Update Request to API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updateData,
    });

    // ✅ Check if API response is HTML (Error case)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      throw new Error("❌ API returned HTML instead of JSON. Possible server error.");
    }

    const responseData = await response.json();
    console.log("✅ API Response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.error || "Failed to update university profile");
    }

    return responseData;
  } catch (error) {
    console.error("❌ Update Failed:", error);
    throw error;
  }
};





/**
 * ✅ Fetch Blog Categories
 * @returns {Promise} - List of categories
 */
export const fetchBlogCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/categories/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch blog categories");
    }
    const data = await response.json();
    return data || []; // ✅ Return an empty array if data is null or undefined
  } catch (error) {
    console.error("❌ Error fetching blog categories:", error);
    throw error;
  }
};



/**
 * ✅ Create Blog Category
 * @param {Object} data - Category data (e.g., { name: "New Category" })
 * @param {string} token - Authentication token
 * @returns {Promise} - API response
 */
export const createBlogCategory = async (data, token) => {
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
      console.error("❌ Create Blog Category API Error:", errorData);
      throw new Error(errorData.detail || "Failed to create blog category");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating blog category:", error);
    throw error;
  }
};

/**
 * ✅ Update Blog Category
 * @param {string} slug - Category slug
 * @param {Object} data - Updated category data (e.g., { name: "Updated Category" })
 * @param {string} token - Authentication token
 * @returns {Promise} - API response
 */
export const updateBlogCategory = async (slug, data, token) => {
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
      console.error("❌ Update Blog Category API Error:", errorData);
      throw new Error(errorData.detail || "Failed to update blog category");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating blog category:", error);
    throw error;
  }
};

/**
 * ✅ Delete Blog Category
 * @param {string} slug - Category slug
 * @param {string} token - Authentication token
 * @returns {Promise} - API response
 */
export const deleteBlogCategory = async (slug, token) => {
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


/**
 * ✅ Fetch News Categories
 * @returns {Promise} - List of categories
 */
export const fetchNewsCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/categories/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch news categories");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("❌ Error fetching news categories:", error);
    throw error;
  }
};

/**
 * ✅ Create News Category
 * @param {Object} data - Category data (e.g., { name: "New Category" })
 * @param {string} token - Authentication token
 * @returns {Promise} - API response
 */
export const createNewsCategory = async (data, token) => {
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

/**
 * ✅ Update News Category
 * @param {string} slug - Category slug
 * @param {Object} data - Updated category data (e.g., { name: "Updated Category" })
 * @param {string} token - Authentication token
 * @returns {Promise} - API response
 */
export const updateNewsCategory = async (slug, data, token) => {
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

/**
 * ✅ Delete News Category
 * @param {string} slug - Category slug
 * @param {string} token - Authentication token
 * @returns {Promise} - API response
 */
export const deleteNewsCategory = async (slug, token) => {
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


// Core Features

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

    if (!response.ok) {
      throw new Error("Failed to fetch districts");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching districts:", error);
    throw error;
  }
};


// ✅ Create District
export const createDistrict = async (data) => {
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
  if (!response.ok) throw new Error("Failed to update district");
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
  if (!response.ok) throw new Error("Failed to delete district");
  return { success: true };
};

// ✅ Fetch Disciplines (Paginated + Searchable)
export const fetchDisciplines = async (page = 1, search = "") => {
  try {
    const url = new URL(`${API_BASE_URL}/disciplines/`);
    url.searchParams.append("page", page);
    if (search) {
      url.searchParams.append("search", search);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch disciplines");
    }

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
  if (!response.ok) throw new Error("Failed to create discipline");
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
  if (!response.ok) throw new Error("Failed to update discipline");
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
  if (!response.ok) throw new Error("Failed to delete discipline");
  return { success: true };
};


// ✅ Fetch Ads (Paginated)
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
      throw new Error("Failed to fetch ads");
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
      ...getAuthHeaders(), // Don't include Content-Type for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create ad");
  }

  return await response.json();
};

// ✅ Update Ad
export const updateAd = async (id, formData) => {
  const response = await fetch(`${API_BASE_URL}/ads/${id}/update/`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(), // No need for Content-Type for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update ad");
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
    throw new Error("Failed to delete ad");
  }

  return { success: true };
};

// Users
export const fetchUsers = async (page = 1, search = "") => {
  const queryParams = new URLSearchParams({ page });
  if (search) queryParams.append("search", search);

  const response = await fetch(
    `${API_BASE_URL}/auth/users/?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(), // ✅ Use existing helper
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch users: ${response.status} - ${errorText}`);
  }

  return await response.json();
};


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


// For Scholarship
// ✅ Fetch Scholarships with Pagination & Search
export const fetchScholarships = async (page = 1, search = "") => {
  try {
    const response = await fetch(`${API_BASE_URL}/scholarship/?page=${page}&search=${search}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch scholarships");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching scholarships:", error);
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
    console.error("Error fetching scholarship details:", error);
    throw error;
  }
};

// ✅ Create Scholarship
export const createScholarship = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/scholarship/create/`, {
    method: "POST",
    headers: getAuthHeaders(), // Must include JWT token
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Response Error:", errorData);
    throw new Error(errorData.error || "Failed to create scholarship");
  }

  return await response.json();
};

// ✅ Update Scholarship
export const updateScholarship = async (slug, formData) => {
  const response = await fetch(`${API_BASE_URL}/scholarship/${slug}/update/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Response Error:", errorData);
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

// Dropdown Apis

// ✅ Fetch minimal list of universities for dropdown (id + name only)
export const fetchUniversitiesDropdown = async (search = "") => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/university/dropdown/?search=${encodeURIComponent(search)}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch universities");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching university dropdown:", error);
    return [];
  }
};

// ✅ Fetch minimal list of destinations for dropdown (id + title only)
export const fetchDestinationsDropdown = async (search = "") => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/destination/dropdown/?search=${encodeURIComponent(search)}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch destinations");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching destination dropdown:", error);
    return [];
  }
};

// ✅ Fetch minimal list of districts for dropdown (id + name only)
export const fetchDistrictsDropdown = async (search = "") => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/district/dropdown/?search=${encodeURIComponent(search)}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch districts");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching district dropdown:", error);
    return [];
  }
};

// ✅ Fetch minimal list of consultancies for dropdown (id + name only)
export const fetchConsultanciesDropdown = async (search = "") => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/consultancy/dropdown/?search=${encodeURIComponent(search)}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch consultancies");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching consultancy dropdown:", error);
    return [];
  }
};
