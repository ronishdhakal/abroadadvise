const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Helper Function: Get Auth Headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken"); // Get stored JWT token
  return token ? { Authorization: `Bearer ${token}` } : {};
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

// ✅ Fetch Universities
export const fetchUniversities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/university/`, {
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

// ✅ Fetch Consultancies with Pagination & Search
export const fetchConsultancies = async (page = 1, search = "") => {
  try {
    const response = await fetch(`${API_BASE_URL}/consultancy/?page=${page}&search=${search}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to fetch consultancies");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error.message);
    throw error;
  }
};

// ✅ Fetch Single Consultancy Details (Ensures Data Pre-Fills)
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

// ✅ Convert Arrays to JSON Before Sending
const convertArrayToJson = (formData, key) => {
  if (formData.has(key)) {
    try {
      const arrayData = JSON.stringify(JSON.parse(formData.get(key))); // ✅ Ensure valid JSON
      formData.set(key, arrayData);
    } catch (error) {
      console.error(`Error processing ${key} data:`, error);
    }
  }
};

// ✅ Create Consultancy (Handles FormData & File Uploads)
// ✅ Create Consultancy (Handles FormData & File Uploads)
export const createConsultancy = async (formData) => {
  try {
    console.log("Submitting FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]); // Logs all fields
    }

    // ✅ Convert boolean values correctly
    if (formData.has("moe_certified")) {
      formData.set("moe_certified", formData.get("moe_certified") === "true");
    }

    if (formData.has("is_verified")) {
      formData.set("is_verified", formData.get("is_verified") === "true"); // ✅ Store as boolean
    }

    // ✅ Convert arrays to JSON
    convertArrayToJson(formData, "branches");
    convertArrayToJson(formData, "study_abroad_destinations");
    convertArrayToJson(formData, "test_preparation");
    convertArrayToJson(formData, "partner_universities");
    convertArrayToJson(formData, "districts");

    const response = await fetch(`${API_BASE_URL}/consultancy/create/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Create Consultancy API Error:", errorData);
      throw new Error(errorData.error || "Failed to create consultancy");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating consultancy:", error);
    throw error;
  }
};

// ✅ Update Consultancy (Handles FormData & File Uploads)
export const updateConsultancy = async (slug, formData) => {
  try {
    console.log("Updating Consultancy FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    // ✅ Convert boolean values correctly
    if (formData.has("moe_certified")) {
      formData.set("moe_certified", formData.get("moe_certified") === "true");
    }

    if (formData.has("is_verified")) {
      formData.set("is_verified", formData.get("is_verified") === "true"); // ✅ Convert to boolean
    }

    // ✅ Convert arrays to JSON
    convertArrayToJson(formData, "branches");
    convertArrayToJson(formData, "study_abroad_destinations");
    convertArrayToJson(formData, "test_preparation");
    convertArrayToJson(formData, "partner_universities");
    convertArrayToJson(formData, "districts");

    // ✅ Handle gallery images properly (Keep old + Add new ones)
    const galleryImages = formData.getAll("gallery_images");
    formData.delete("gallery_images");

    galleryImages.forEach((file) => {
      if (file instanceof File) {
        formData.append("gallery_images", file); // Append only new files
      }
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
  } catch (error) {
    console.error("Error updating consultancy:", error);
    throw error;
  }
};

// ✅ NEW: Toggle Consultancy Verification
export const toggleConsultancyVerification = async (slug, isVerified) => {
  try {
    const response = await fetch(`${API_BASE_URL}/consultancy/${slug}/update/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // ✅ Ensure JSON format
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ is_verified: isVerified }), // ✅ Fix: Send JSON data
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Verification Toggle Error:", errorData);
      throw new Error(errorData.error || "Failed to update verification");
    }

    const updatedData = await response.json();
    console.log(`✅ Consultancy verification updated: ${updatedData.is_verified}`);

    return updatedData; // ✅ Return updated consultancy data for UI update
  } catch (error) {
    console.error("❌ Error updating verification:", error);
    throw error;
  }
};


// ✅ Delete Consultancy
export const deleteConsultancy = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/consultancy/${slug}/delete/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Backend Delete Error:", errorData);
      throw new Error(errorData.message || "Failed to delete consultancy");
    }

    console.log("✅ Consultancy deleted successfully!");
    return { success: true, message: "Consultancy deleted successfully!" };
  } catch (error) {
    console.error("❌ Error deleting consultancy:", error);
    throw new Error(error.message || "An error occurred while deleting the consultancy.");
  }
};



