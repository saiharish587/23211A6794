/**
 * A custom fetch wrapper that logs requests, responses, and errors.
 */
export async function fetchWithLogging(url, options = {}) {
  const method = options.method || "GET";
  const timestamp = new Date().toISOString();
  
  console.log(`[API Request] ${method} ${url} at ${timestamp}`);
  
  try {
    const response = await fetch(url, options);
    console.log(`[API Response] ${method} ${url} - Status: ${response.status}`);
    
    if (!response.ok) {
      console.warn(`[API Warning] ${method} ${url} failed with status ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error(`[API Error] ${method} ${url} failed:`, error.message);
    throw error;
  }
}
