export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token") || null;
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token") || null;
  }
  return null;
};

export const getUserRole = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user_role") || null;
  }
  return null;
};

export const setAuthToken = (accessToken, refreshToken, role, consultancyId = null, universityId = null) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
    if (role) {
      localStorage.setItem("user_role", role);
    }

    // ✅ Store respective IDs
    if (role === "consultancy" && consultancyId) {
      localStorage.setItem("consultancy_id", consultancyId);
    }
    if (role === "university" && universityId) {
      localStorage.setItem("university_id", universityId);
    }
  }
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("consultancy_id");
    localStorage.removeItem("university_id");
  }
};

/**
 * ✅ Refresh Access Token when expired
 */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.error("No refresh token available.");
    removeAuthToken();
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token. Logging out...");
      removeAuthToken();
      return null;
    }

    const data = await response.json();
    setAuthToken(data.access, refreshToken, getUserRole()); // Keep the same refresh token and role
    return data.access;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
};

/**
 * ✅ Fetch API with Token Refresh Handling
 */
export const fetchWithAuth = async (url, options = {}) => {
  let token = getAuthToken();

  // Attempt refresh if token is missing
  if (!token) {
    token = await refreshAccessToken();
    if (!token) throw new Error("Authentication failed. Please log in again.");
  }

  // ✅ Attach Authorization header
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let response = await fetch(url, options);

  // ✅ Handle 401 Unauthorized (Token Expired)
  if (response.status === 401) {
    console.warn("Access token expired, attempting to refresh...");
    token = await refreshAccessToken();

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
      response = await fetch(url, options); // Retry with refreshed token
    }
  }

  return response;
};
