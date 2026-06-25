import { useState, useEffect } from "react";

export function useReadNotifications() {
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem("readNotifications");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("readNotifications", JSON.stringify(readIds));
  }, [readIds]);

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
    }
  };

  const isRead = (id) => readIds.includes(id);

  return { readIds, markAsRead, isRead };
}
