import { fetchWithLogging } from "./loggingMiddleware";

const API_URL = "http://4.224.186.213/evaluation-service/notifications";

export async function fetchNotifications({ page = 1, limit = 10, notification_type = "" } = {}) {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (notification_type && notification_type !== "All") params.append("notification_type", notification_type);

  const url = `${API_URL}?${params.toString()}`;
  
  let token = import.meta.env.VITE_API_TOKEN || "";
  // Strip quotes if they were mistakenly included in the value
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }
  if (token && !token.startsWith("Bearer ")) {
    token = `Bearer ${token}`;
  }

  const response = await fetchWithLogging(url, {
    headers: {
      "Authorization": token,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }

  return response.json();
}
