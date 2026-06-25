import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";

export function useNotifications(options = {}) {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We stringify options to correctly trigger useEffect when options change deeply
  const optionsStr = JSON.stringify(options);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const parsedOptions = JSON.parse(optionsStr);
        const data = await fetchNotifications(parsedOptions);
        setNotifications(data.notifications ?? []);
        // The API might not return total. We assume length or pass options.limit.
        setTotal(data.total ?? data.notifications?.length ?? 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [optionsStr]);

  // If there's no real pagination from the backend, we might assume totalPages based on `total` and `limit`.
  // Wait, does the backend return `total`? Assuming it does or we just calculate it.
  const limit = options.limit || 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { notifications, total, totalPages, loading, error };
}
