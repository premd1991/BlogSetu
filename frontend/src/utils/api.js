const API_BASE_URL = "http://localhost:3000/api/v1";

/**
 * Standardized API client utilizing native Fetch API
 * automatically configured for cookie-based credentials
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Set default credentials to 'include' to send/receive httpOnly cookies
  const defaultOptions = {
    credentials: "include",
    headers: {},
    ...options,
  };

  // Automatically content-type json if body is passed as raw object
  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    defaultOptions.headers = {
      "Content-Type": "application/json",
      ...defaultOptions.headers,
    };
    defaultOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: data.message || data.error || "An error occurred",
        data: data
      };
    }

    return {
      success: true,
      status: response.status,
      message: data.message || "Success",
      data: data
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error.message || "Network connection failure",
      data: null
    };
  }
}
