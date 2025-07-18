// lib/apiHelpers.js

/**
 * Helper for making API requests with fetch
 * @param {string} url - API endpoint
 * @param {object} options - fetch options: method, headers, body, etc.
 * @returns {Promise<object>} - JSON response or throws error
 */
export async function apiRequest(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      // Try to parse error message from response
      let errorMsg = `HTTP error! status: ${res.status}`;
      if (contentType.includes("application/json")) {
        const errorData = await res.json();
        errorMsg = errorData?.message || errorMsg;
      } else {
        const text = await res.text();
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }

    if (contentType.includes("application/json")) {
      return await res.json();
    }
    return await res.text();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

/**
 * GET request helper
 * @param {string} url
 * @returns {Promise<object>}
 */
export async function get(url) {
  return apiRequest(url, { method: "GET" });
}

/**
 * POST request helper
 * @param {string} url
 * @param {object} data - JSON payload
 * @returns {Promise<object>}
 */
export async function post(url, data) {
  return apiRequest(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * PUT request helper
 * @param {string} url
 * @param {object} data - JSON payload
 * @returns {Promise<object>}
 */
export async function put(url, data) {
  return apiRequest(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request helper
 * @param {string} url
 * @returns {Promise<object>}
 */
export async function del(url) {
  return apiRequest(url, {
    method: "DELETE",
  });
}
