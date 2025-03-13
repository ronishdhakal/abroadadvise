const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Helper Function: Get Auth Headers
const getAuthHeaders = () => {
  if (typeof window !== "undefined") {  // ✅ Ensure running in browser
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {}; // ✅ Return empty headers on server-side
};


// ✅ Fetch Districts
export const fetchDistricts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/districts/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch districts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

// ✅ Fetch Study Destinations
export const fetchDestinations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/destination/`, {
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

// ✅ Fetch Disciplines (Needed for University Form Dropdowns)
export const fetchDisciplines = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/disciplines/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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

// ✅ Fetch Test Preparation Exams
export const fetchExams = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/exam/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch exams");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching exams:", error);
    throw error;
  }
};

// Fetch COurses
export const fetchCourses = async (page = 1) => {
  try {
    // Ensure `page` is always an integer (Default to 1 if undefined)
    const pageNumber = Number(page) || 1;
    
    console.log("🔍 Fetching courses from:", `${API_BASE_URL}/course/?page=${pageNumber}`);

    const response = await fetch(`${API_BASE_URL}/course/?page=${pageNumber}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Log API response if it fails
      throw new Error(`Failed to fetch courses: ${errorMessage}`);
    }

    return await response.json();
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



// ✅ Utility function to ensure proper JSON conversion
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
    const intArray = value.map((item) => parseInt(item, 10)).filter((id) => !isNaN(id));
    formData.set(key, JSON.stringify(intArray));
};

// ✅ Create Consultancy
export const createConsultancy = async (formData) => {
    // ✅ Convert boolean fields correctly
    formData.set("moe_certified", formData.get("moe_certified") === "true");
    formData.set("is_verified", formData.get("is_verified") === "true");

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

// ✅ Create Course (Handles FormData & File Uploads)
export const createCourse = async (formData) => {
  try {
    console.log("📤 Sending Course FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);  // ✅ Logs all form data values
    }

    const response = await fetch(`${API_BASE_URL}/course/create/`, {
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
    console.log("📤 Updating Course FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    console.log("🖼️ Icon File:", formData.get("icon"));
    console.log("🖼️ Cover Image File:", formData.get("cover_image"));

    const response = await fetch(`${API_BASE_URL}/course/${slug}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(), // ⚠️ Do NOT manually set "Content-Type"
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Debug raw response
      console.error("❌ Update Course API Error:", errorText);
      throw new Error("Failed to update course");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating course:", error);
    throw error;
  }
};

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
