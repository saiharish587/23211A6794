import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AssessmentIcon from "@mui/icons-material/Assessment";
import WorkIcon from "@mui/icons-material/Work";

const typeConfig = {
  Event: { color: "info", icon: <EventIcon fontSize="small" /> },
  Result: { color: "warning", icon: <AssessmentIcon fontSize="small" /> },
  Placement: { color: "success", icon: <WorkIcon fontSize="small" /> },
};

export function NotificationCard({ notification, isRead, onMarkAsRead }) {
  const config = typeConfig[notification.Type] || typeConfig.Event;

  return (
    <Card 
      onClick={() => onMarkAsRead(notification.ID)}
      sx={{ 
        cursor: "pointer", 
        borderLeft: isRead ? "none" : "4px solid",
        borderColor: "primary.main",
        bgcolor: isRead ? "background.paper" : "action.hover",
        transition: "background-color 0.2s ease"
      }}
    >
      <CardContent sx={{ pb: "16px !important" }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Chip 
            label={notification.Type} 
            color={config.color} 
            size="small" 
            icon={config.icon}
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(notification.Timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          fontWeight={isRead ? 400 : 600}
        >
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
}
