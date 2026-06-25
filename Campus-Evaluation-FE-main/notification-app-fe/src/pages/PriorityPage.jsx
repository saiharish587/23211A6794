import { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import { useReadNotifications } from "../hooks/useReadNotifications";

export function PriorityPage() {
  const [filter, setFilter] = useState("All");
  const [limit, setLimit] = useState(10);
  const { readIds, markAsRead, isRead } = useReadNotifications();

  const { notifications, loading, error } = useNotifications({
    limit: limit,
    notification_type: filter,
  });

  const handleFilterChange = (_, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleLimitChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      setLimit(val);
    }
  };

  // Sort logically for priority: Placement > Result > Event
  // The API might already do this if we pass limit, but just in case:
  const weight = { Placement: 3, Result: 2, Event: 1 };
  const sortedNotifications = [...notifications].sort((a, b) => {
    const wA = weight[a.Type] || 0;
    const wB = weight[b.Type] || 0;
    if (wA !== wB) return wB - wA;
    return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
  });

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <InboxIcon sx={{ fontSize: 28, color: "primary.main" }} />
        <Typography variant="h5" fontWeight={700}>
          Priority Inbox
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
        <TextField
          label="Top N"
          type="number"
          size="small"
          value={limit}
          onChange={handleLimitChange}
          inputProps={{ min: 1 }}
          sx={{ width: 100 }}
        />
      </Stack>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load priority notifications: {error}</Alert>
      )}

      {!loading && !error && sortedNotifications.length === 0 && (
        <Alert severity="info">No priority notifications to display.</Alert>
      )}

      {!loading && !error && sortedNotifications.length > 0 && (
        <Stack spacing={1.5}>
          {sortedNotifications.map((n) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              isRead={isRead(n.ID)}
              onMarkAsRead={markAsRead}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
